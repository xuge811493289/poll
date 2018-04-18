<!-- 课调管理页面 -->
<template>
	<div class="clazzSurveyManages">
		<div class="options">
			<el-input clearable size="small" placeholder="请输入内容" v-model="key" class="input-with-select">
			    <el-select v-model="selectKey" slot="prepend" placeholder="请选择">
			      <el-option label="教师名称" value="teacher.realname"></el-option>
			      <el-option label="课程名称" value="course.name"></el-option>
			      <el-option label="班级名称" value="clazz.name"></el-option>
			      <el-option label="问卷模板" value="questionnaire.name"></el-option>
			      <el-option label="课调状态" value="status"></el-option>
			      <el-option label="课调日期" value="date"></el-option>
			      <el-option label="课调编号" value="random"></el-option>
			    </el-select>
			    <el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>
			<el-button type="success" icon="el-icon-plus" size='mini' @click='toAdd'>添加课调</el-button>
			<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDelete'>批量删除</el-button>
		</div>
		<div class="tblData">
			<el-table height="476" ref="table" :data="surveysList" style="width: 100%" size='mini' :border='tblBorder' @row-click="toggleSelection" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"> </el-table-column>
		      	<el-table-column align="center" prop="teacher.realname" label="教师名称"> </el-table-column>
		      	<el-table-column align="center" prop="course.name" label="课程名称"> </el-table-column>
		      	<el-table-column align="center" prop="clazz.name" label="班级名称"> </el-table-column>
		      	<el-table-column align="center" prop="questionnaire.name" label="问卷模板"> </el-table-column>
		      	<el-table-column  align="center" prop="status" label="课调状态"> </el-table-column>
		      	<el-table-column align="center" prop="date" label="课调日期"  width="155"> </el-table-column>
		      	<el-table-column align="center" prop="random" label="课调编号"> </el-table-column>
		      	<el-table-column align="center" label="操作" width="110">
			      	<template slot-scope="scope">
			        	<i class="fa fa-play-circle" title="开启" @click="toBeginSurvey(scope.$index, scope.row)" style="color:#67C23A"></i>
			        	<i class="fa fa-hourglass-end" title="查看进度" style="color:#409EFF" @click="toSeeProgress(scope.$index, scope.row)"></i>
			        	<i class="fa fa-power-off" title="结束" style="color:#ffb35f" @click="toEndSurvey(scope.$index, scope.row)"></i>
			        	<i class="fa fa-trash-o" style="color:#F56C6C" title="删除" @click="toDeleteSurvey(scope.$index, scope.row)"></i>
			      	</template>
			    </el-table-column>
		    </el-table>	
		</div>
		<!-- 添加课调的模态框 -->
		<el-dialog center :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		  <el-form :model="form" :rules="rules" ref="form">
		    <el-form-item label="教师名称" prop="teacherid" :label-width="formLabelWidth">
		      	<el-select v-model="form.teacherid" placeholder="请选择">
			    	<el-option v-for="teacher in teachers" :key="teacher.id" :label="teacher.realname" :value="teacher.id">
			    	</el-option>
			  	</el-select>
		    </el-form-item>
		    <el-form-item label="班级名称" prop="clazzid" :label-width="formLabelWidth">
		      	<el-select v-model="form.clazzid" placeholder="请选择">
			    	<el-option v-for="clazz in classesliuyr" :key="clazz.id" :label="clazz.name" :value="clazz.id">
			    	</el-option>
			  	</el-select>
		    </el-form-item>
		    <el-form-item label="课程名称" prop="courseid" :label-width="formLabelWidth">
		    	<el-select v-model="form.courseid" placeholder="请选择">
			    	<el-option v-for="course in coursesLiuyr" :key="course.id" :label="course.name" :value="course.id">
			    	</el-option>
			  	</el-select>
		    </el-form-item>
		    <el-form-item label="选择问卷模板" prop="questionnaireid" :label-width="formLabelWidth">
		      	<el-select v-model="form.questionnaireid" placeholder="请选择">
			    	<el-option v-for="questionnaire in questionnaires" :key="questionnaire.id" :label="questionnaire.name" :value="questionnaire.id">
			    	</el-option>
			    </el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="handleCancel">取 消</el-button>
		    <el-button size='mini' type="primary" @click="handleSubmit('form')">创建课调</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	export default {
		data(){
			return {
				key:'',
				selectKey:'',
				value:'',
				tblBorder:true,
				dialogFormTitle:'添加课调信息',
				dialogFormVisible:false,
				formLabelWidth:'260px',
				form:{},
				multipleSelection:[],	//复选框多选
				rules:{
					teacherid:[
						{ required: true, message: '请选择教师', trigger: 'change' },
					],
					clazzid:[
						{ required: true, message: '请选择班级', trigger: 'change' }
					],
					courseid:[
						{ required: true, message: '请选择课程', trigger: 'change' }
					],
					questionnaireid:[
						{ required: true, message: '请选择问卷模板', trigger: 'change' }
					]
				}
			}
		},
		//映射数据
		computed:{
			//过滤显示 通过教师名称，班级名称，课程名称，课调日期、课调状态、课调编号等过滤课调
			surveysList:function(){
				let vm = this;
				// 过滤筛选
				if(this.surveys&&this.surveys.length>0){
					return this.surveys.filter((item)=>{
						if(vm.selectKey){
							if(vm.selectKey==='teacher.realname'){
								return item.teacher.realname.indexOf(vm.key)!=-1;
							}
							if(vm.selectKey==='clazz.name'){
								return item.clazz.name.indexOf(vm.key)!=-1;
							}
							if(vm.selectKey==='course.name'){
								return item.course.name.indexOf(vm.key)!=-1;
							}
							if(vm.selectKey==='questionnaire.name'){
								return item.questionnaire.name.indexOf(vm.key)!=-1;
							}
							return item[vm.selectKey].indexOf(vm.key)!=-1;
						}else{
							return vm.surveys;
						}
					});
				}else{
					return null;
				}
			},
			...mapGetters(['teachers','classesliuyr','coursesLiuyr','questionnaires','surveys'])
		},
		//初始化数据
		created(){
			this.findAllTeachers();
			this.finsAllClassesLiuyr();
			this.finsAllCoursesLiuyr();
			this.findAllQuestionnaire();
			this.findAllSurveys();
		},
		methods:{
			toggleSelection(row,event,column){
				this.$refs.table.toggleRowSelection(row);
		    },
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    //模态框取消
			handleCancel(){
				this.dialogFormVisible = false;
				this.findAllSurveys();
			},
			//模态框确认提交
			handleSubmit(form){
				this.$refs[form].validate((valid) => {
			        if (valid) {
			            this.saveSurveys(this.form).then((result)=>{
							this.$message({type: 'success', message: '添加课调成功!'});
		          			//关闭模态框并更新数据
							this.handleCancel();
						}).catch((error)=>{
							this.$message({type: 'info', message: '添加课调失败!'});
						});
			        } else {
			            return false;
			        }
		        });
			},
		    //跳转到添加页面（弹出模态框）
			toAdd(){
				this.form={};
				this.dialogFormVisible = true;
			},
			// 查看课调进度
			toSeeProgress(index,row){
				if(row.status==='正在课调' | row.status==="待审核"){
					this.showSchedule(row.id).then((data)=>{
		        		this.$alert('参与人数:'+data.count+',有效份数:'+data.valid, '课调进度', {confirmButtonText: '确定'});
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '查询失败!'});
		        	});
				}else{
					this.$message({type: 'warning', message: '课调还未开启!'});
				}
			},
			// 开启课调
			toBeginSurvey(index,row){
				if(row.status==="可开启"){
					this.openSurvey(row.id).then(()=>{
		        		this.$message({type: 'success', message: '开启成功!'});
		        		this.findAllSurveys();
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '开启失败!'});
		        	});
				}else{
					this.$message({type: 'warning', message: '课调已经开启!'});
				}
			},
			// 结束课调
			toEndSurvey(index,row){
				if(row.status==="正在课调"){
					this.endSurvey(row.id).then(()=>{
		        		this.$message({type: 'success', message: '结束成功!'});
		        		this.findAllSurveys();
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '结束失败!'});
		        	});
				}else{
					this.$message({type: 'warning', message: '课调已经结束或者未开启!'});
				}
			},
			//删除
			toDeleteSurvey(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.batchDeleteSurveys(row.id).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		this.findAllSurveys();
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '删除失败!'});
		        	});
		        }).catch(() => {
		          	this.$message({type: 'info', message: '已取消删除'});
		        });
			},
			//批量删除
			handleBatchDelete(){
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
			        	this.batchDeleteSurveys(ids).then(()=>{
			        		this.$message({type: 'success', message: '删除成功!'});
			        		this.findAllSurveys();
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
				'findAllTeachers',
				'finsAllClassesLiuyr',
				'finsAllCoursesLiuyr',
				'findAllQuestionnaire',
				'findAllSurveys',
				'saveSurveys',
				'batchDeleteSurveys',
				'openSurvey',
				'endSurvey',
				'showSchedule'
			])
		}
	}
</script>