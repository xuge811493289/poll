<!-- 问卷模板页面 -->
<template>
	<div class="questionnaireTemps">
		<div class="department">
			<div class="options">
				<el-button type="success" icon="el-icon-plus" size='mini' @click='toAdd'>添加</el-button>
				<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDelete'>批量删除</el-button>
			</div>
			<div class="tblData">
				<el-table height="476" ref="table" :data="questionnaires" style="width: 100%" size='mini' :border='tblBorder' @row-click="toggleSelection" @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection"	width="55"> </el-table-column>
		      		<el-table-column align="center" prop="name"label="名称"> </el-table-column>
		      		<el-table-column align="center" prop="role"label="描述"> </el-table-column>
		      		<el-table-column align="center" label="操作" width="100">
				      <template slot-scope="scope">
				        <i class="fa fa-edit" title="编辑" @click="toEdit(scope.$index, scope.row)"></i>
				        <i class="fa fa-trash-o danger" style="color:#f56c6c" title="删除" @click="handleDelete(scope.$index, scope.row)"></i>
				        <i class="fa fa-eye" title="预览" style="color:#67C23A" @click="toSee(scope.$index, scope.row)"></i>
				      </template>
			    	</el-table-column>
		    	</el-table>	
			</div>
		</div>
		<!-- 修改问卷的模态框 -->
		<el-dialog center :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		  <el-form :model="form">
		    <el-form-item label="问卷名称" :label-width="formLabelWidth">
		      <el-input clearable v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="问卷作用" :label-width="formLabelWidth">
		      <el-input type='textarea' v-model="form.role" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="handleCancel">取 消</el-button>
		    <el-button size='mini' type="primary" @click="handleSubmit">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import {mapGetters,mapActions,mapMutations} from 'vuex';
	export default {
		data(){
			return {
				multipleSelection:[],
				tblBorder:true,
				dialogFormTitle:'修改问卷信息',
				dialogFormVisible:false,
				formLabelWidth:'120px',
				form:{}
			}
		},
		//映射数据
		computed:{
			...mapGetters(['questionnaires'])
		},
		created(){
			this.findAllQuestionnaire();
		},
		methods:{
			toggleSelection(row,event,column){
				this.$refs.table.toggleRowSelection(row);
		    },
			//添加问卷
			toAdd(){
				//跳转到问卷设置页面，直接更改路由
				this.$router.push('/settings/questionnaire/createQuestionnaire');
			}, 
			//预览问卷
			toSee(index,row){
				//以新选项卡的方式打开预览的页面，并且传递row.id
				// alert(row.id);
				http://120.78.164.247:8080/poll/
				window.open('http://120.78.164.247:8080/poll/manager/previewQuestionByqueId.action?queId='+row.id);
			},
			//修改
			toEdit(index,row){
				this.form.name = row.name;
				this.form.role = row.role;
				this.form.id = row.id;
				this.dialogFormVisible = true;
			},
			//模态框取消
			handleCancel(){
				this.dialogFormVisible = false;
				this.findAllQuestionnaire();
			},
			//确认提交
			handleSubmit(){
				this.saveQuestinnaires(this.form).then((result)=>{
					this.$message({type: 'success', message: '操作成功!'});
          			//关闭模态框并更新数据
					this.handleCancel();
				}).catch((error)=>{
					this.$message({type: 'info', message: '操作失败!'});
					// console.log(error);
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
			        	this.batchDeleteQuestionnaires(ids).then(()=>{
			        		this.$message({type: 'success', message: '删除成功!'});
			        		this.findAllQuestionnaire();
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
			//删除
			handleDelete(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.batchDeleteQuestionnaires(row.id).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		this.findAllQuestionnaire();
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '删除失败!'});
		        	});
		        }).catch(() => {
		          	this.$message({type: 'info', message: '已取消删除'});
		        });
			},
			//获取已经选择的
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    //映射Store中的方法
		    ...mapActions([
				'findAllQuestionnaire',
				'saveQuestinnaires',
				'batchDeleteQuestionnaires',
			]),
			...mapMutations(['alterQueIdData'])
		}
	}
</script>