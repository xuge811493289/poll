<!-- 单个课调审核（答卷审核）页面 -->
<template>
	<div class="clazzSurveyManages">
		<div class="options">
			<el-button type="warning" icon="el-icon-error" size='mini' @click='toAbandon'>作废</el-button>
			<el-button type="success" icon="el-icon-plus" size='mini' @click='toPass'>审核通过</el-button>
			<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDeleteAnswerSheet'>批量删除</el-button>
		</div>
		<div class="tblData">
			<el-table height="476" ref="table" :data="choices" style="width: 100%" size='mini' :border='tblBorder' @row-click="toggleSelection" @selection-change="handleSelectionChange">
				<el-table-column fixed align="center" type="selection" width="55"> </el-table-column>
				<el-table-column v-for="item in choicesArr" :width="columnWidth" align="center" :prop="item.prop" :key="item.key" :label="item.label"></el-table-column>
		      	
		      	<el-table-column fixed="right" align="center" label="操作" width="100">
			      	<template slot-scope="scope">
			        	<i class="fa fa-edit" title="编辑" @click="toEdit(scope.$index, scope.row)"></i>
			        	<i class="fa fa-trash-o" style="color:#F56C6C" title="删除" @click="toDeleteAnswerSheet(scope.$index, scope.row)"></i>
			      	</template>
			    </el-table-column>
		    </el-table>	
		</div>
		<!-- 修改答卷的模态框 -->
		<el-dialog center :before-close="handleCancel" :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		  <el-form>
		  	<el-form-item v-for="item in editChoicesArr"  :label="item.name" :label-width="formLabelWidth" :key="item.choice.subjectId">
		      <el-input clearable v-model="item.choice.answer" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="handleCancel">取 消</el-button>
		    <el-button size='mini' type="primary" @click="handleSubmit">确定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	export default {
		data(){
			return {
				tblBorder:true,
				dialogFormTitle:'修改学生的答卷信息',
				dialogFormVisible:false,
				formLabelWidth:'70px',
				columnWidth:'300',
				// form:{},
				multipleSelection:[],	//复选框多选,
				labelArr:['简答题一','简答题二','简答题三','简答题四','简答题五','简答题六','简答题七','简答题八','简答题九','简答题十'],
				// 点击编辑之后的模态框的数据arr
				editChoicesArr:[],
				//循环生成列
				choicesArr:[],
				rowTemp:{}
			}
		},
		//映射数据
		computed:{
			simpleAnswersLength(){
				if(this.choices.length!==0&&this.choices[0].simpleAnswers.length){
					return this.choices[0].simpleAnswers.length;
				}
				return 0;
			},
			//过滤显示 通过教师名称，班级名称，课程名称，课调日期、课调状态、课调编号等过滤课调
			//获取课调信息和学生的答卷
			...mapGetters(['surveyInfo','choices'])
		},
		//初始化数据
		created(){
			this.choicesArrMethods();
		},
		methods:{
			choicesArrMethods(){
				for(let i=0;i<this.simpleAnswersLength;i++){
					let obj = {
						label:this.labelArr[i],
						prop:'simpleAnswers['+i+'].answer',
						key:'simpleAnswers['+i+'].subjectId'
					};
					this.choicesArr.push(obj);
				}
			},
			// 单击某行切换选中状态
			toggleSelection(row,event,column){
				this.$refs.table.toggleRowSelection(row);
		    },
			// 模态框关闭之前
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    //模态框取消
			handleCancel(){
				this.editChoicesArr = [];
				this.rowTemp = {};
				this.dialogFormVisible = false;
				this.findChoiceBySurveyId(this.surveyInfo.id);
			},
			//丢弃 删除本次课调
			toAbandon(){
				// 获取本次课调的id
				let surveyId = this.surveyInfo.id;
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.batchDeleteSurveys(surveyId).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		this.$router.push('/questionnaire/clazzSurveyCheck');
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '删除失败!'});
		        	});
		        }).catch(() => {
		          	this.$message({type: 'info', message: '已取消删除'});
		        });
			},
			//通过审核，修改课调的状态
			toPass(){
				//是否是修改课调的某个状态来实现，然后查看课调分数的时候就是只能查看审核通过的课调
				let surveyId = this.surveyInfo.id;
				this.checkSurvey(surveyId).then(()=>{
	        		this.$message({type: 'success', message: '审核成功!'});
	        		// 跳转路由，继续审核
	        		this.$router.push('/questionnaire/clazzSurveyCheck');
	        	}).catch(()=>{
	        		this.$message({type: 'info', message: '审核失败!'});
	        	});
			},
			//模态框出现
			toEdit(index,row){
				this.rowTemp = row;
		    	for(let i=0;i<this.simpleAnswersLength;i++){
		    		let tempObj = {
		    			name : this.labelArr[i],
		    			choice: row.simpleAnswers[i],
		    		};
					this.editChoicesArr.push(tempObj);
		    	}
				this.dialogFormVisible = true;
			},
			//模态框确认提交
			handleSubmit(){
				let form = {};
				form.editChoicesArr = this.editChoicesArr;
				//获取答卷id
				form.id = this.rowTemp.id;
	            this.changeChoices(form).then((result)=>{
					this.$message({type: 'success', message: '修改成功!'});
          			//关闭模态框，并刷新
					this.handleCancel();
				}).catch((error)=>{
					this.$message({type: 'info', message: '修改失败!'});
				});
			},
			//删除
			toDeleteAnswerSheet(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.batchDeleteAnswerSheets(row.id).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		//更新数据
		        		this.findChoiceBySurveyId(this.surveyInfo.id);
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '删除失败!'});
		        	});
		        }).catch(() => {
		          	this.$message({type: 'info', message: '已取消删除'});
		        });
			},
			//批量删除
			handleBatchDeleteAnswerSheet(){
				//获取要删除的ID
	        	let ids = this.multipleSelection.map((item)=>{
	        		return item.id;
	        	});
	        	if(ids.length>0){
	        		this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	//执行删除操作
			        	this.batchDeleteAnswerSheets(ids).then(()=>{
			        		this.$message({type: 'success', message: '删除成功!'});
			        		// 更新
			        		this.findChoiceBySurveyId(this.surveyInfo.id);
			        	}).catch(()=>{
			        		this.$message({type: 'info', message: '删除失败!'});
			        	});
			        }).catch(() => {
			          this.$message({type: 'info', message: '已取消删除'});
			        });
	        	}else{
	        		this.$message({type: 'info', message: '请选择要删除的数据'});
	        	}
			},
			//vuex映射的动作
			...mapActions([
				'findChoiceBySurveyId',
				'changeChoices',
				'batchDeleteAnswerSheets',
				'batchDeleteSurveys',
				'checkSurvey'
			])
		}
	}
</script>