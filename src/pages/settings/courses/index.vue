<template>
	<div class="courses">
		<div class="options couresSelectStyle">
			<el-input size="small" placeholder="请输入内容" v-model="searchValue" class="input-with-select">
				    <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
				      <el-option label="名称" value="name"></el-option>
				      <el-option label="周期" value="cycle"></el-option>
				    </el-select>
				    <el-button slot="append" icon="el-icon-search" @click='toSearch' class='elBtn'></el-button>
				</el-input>
			<!-- <div class="searchDiv">
				<el-input
			    placeholder="请输入要搜索的课程名称"
			    v-model="searchData" style="width:300px" size="small">
			    <i slot="prefix" class="el-input__icon el-icon-search"></i>
			  </el-input>
			<el-button type="primary" icon="el-icon-search" size='mini' @click='toSearch'>搜索</el-button>
			</div> -->
			<el-button type="success" icon="el-icon-plus" size='mini' @click='toAdd'>添加</el-button>
			<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDelete'>批量删除</el-button>
		</div>
		<div class="tblData">
			<el-table :data="courseList"style="width: 100%" ref="table" size='mini' :border='tblBorder' @selection-change="handleSelectionChange" @row-click="toggleSelection">
				<el-table-column type="selection"	width="55"> </el-table-column>
	      <el-table-column prop="name" align="center" label="名称"> </el-table-column>
	      <el-table-column prop="cycle" align="center" label="周期"> </el-table-column>
	      <el-table-column prop="description" align="center" label="描述"> </el-table-column>
	      <el-table-column label="操作" align="center" width="100">
		      <template slot-scope="scope">
		        <i class="fa fa-edit" @click="toEdit(scope.$index, scope.row)"></i>
		        <i class="fa fa-trash-o danger" style="color:#f56c6c" @click="handleDelete(scope.$index, scope.row)"></i>
		      </template>
		    </el-table-column>
	    </el-table>	
		</div>
		<!-- 添加班级的模态框 -->
		<el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" center>
		  <el-form :model="form" :rules="rules" ref="form">
		    <el-form-item label="课程名称" :label-width="formLabelWidth" prop='name'>
		      <el-input v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="课程周期" :label-width="formLabelWidth" prop='cycle'>
		      <el-input v-model="form.cycle" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="课程描述" :label-width="formLabelWidth" prop='description'>
		      <el-input type='textarea' v-model="form.description" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="dialogFormVisible = false">取 消</el-button>
		    <el-button size='mini' type="primary" @click="handleSubmit('form')">确 定</el-button>
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
				dialogFormTitle:'添加课程信息',
				dialogFormVisible:false,
				formLabelWidth:'120px',
				form:{
					//为了解决select无效的问题
					name:null,
					cycle:null
				},
				searchValue:'',
				searchKey:'',
				multipleSelection:[],	//复选框多选
				rules:{
					name:[
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
            			
					],
					cycle:[
						{ required: true, message: '请输入课程周期', trigger: 'blur' }
					],
					description:[
						{ required: true, message: '请输入课程描述', trigger: 'blur' }
					]
				}
			}
		},
		//映射数据
		computed:{
			//过滤显示 通过名字，描述，部门过滤方向
			courseList:function(){
				var vm = this;
				return this.coursess.filter((item)=>{
					if(vm.searchKey){
						if(vm.searchKey==='name'){
							return item.name.indexOf(vm.searchValue)!=-1;
						}else if(vm.searchKey==='cycle'){
							return String(item.cycle).indexOf(vm.searchValue)!=-1;
						}
						//return item[vm.searchKey].indexOf(vm.searchValue)!=-1;
					}else{
						return vm.coursess;
					}
				});
				
			},
			...mapGetters(['coursess','searchDatas'])
		},
		//初始化数据
		created(){
			this.findAllCourses_c();
		},
		methods:{
			toggleSelection(row,event,column){
		      	this.$refs.table.toggleRowSelection(row);
		      },
			handleSelectionChange(val) {
        		this.multipleSelection = val;
      		},
      //跳转到添加页面（弹出模态框）
			toAdd(){
				this.form={};
				this.dialogFormTitle='添加课程信息';
				this.dialogFormVisible = true;
			},
			//点击搜索
			toSearch(){
				let obj={
					param:this.searchKey,
					value:this.searchValue
				}
				
				this.searchByCourseName_c(obj);

			},
			//确认提交
			handleSubmit(formName){
				
				 this.$refs[formName].validate((valid) => {
		          if (valid) {
		            this.saveCourses_c(this.form).then((result)=>{
							this.$message({type: 'success', message: '操作成功!'});
		          //关闭模态框
							this.dialogFormVisible = false;
							
							this.findAllCourses_c();
					}).catch((error)=>{
						console.log(error);
					});

		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
			
				
			},
			//更新
			toEdit(index,row){
				this.form.name = row.name;
				this.form.description = row.description;
				this.form.id = row.id;
				this.form.cycle = row.cycle;
				this.dialogFormTitle='修改课程信息';
				this.dialogFormVisible = true;


			},
			//删除
			handleDelete(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.batchDeleteCourses_c(row.id).then(()=>{
        		this.$message({type: 'success', message: '删除成功!'});
        		this.findAllCourses_c();
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
				        	this.batchDeleteCourses_c(ids).then(()=>{
				        		this.$message({type: 'success', message: '删除成功!'});
				        		this.findAllCourses_c();
				        	}).catch(()=>{
				        		this.$message({type: 'info', message: '删除失败!'});
				        	});
				          this.$message({type: 'success', message: '删除成功!'});
				        }).catch(() => {
				          this.$message({type: 'info', message: '已取消删除'});
				        });
        	}else{
        			this.$message({type: 'info', message: '请选择要删除的信息'});
        	}
				
			},
		//vuex映射的动作
		...mapActions([
			'findAllCourses_c',
			'saveCourses_c',
			'batchDeleteCourses_c',
			'searchByCourseName_c'
		])
		}
	}
</script>
<style>
.tblData{
		text-align: center
	}
/*	i.fa {
		cursor: pointer;
	}
	.tblData{
		text-align: center
	}
	.tblData thead th{
		background-color: #e1e1e1;
	}
	.options {
		text-align: right;
		margin-bottom: 2px;
	}
*/
/*.couresSelectStyle .input-with-select{
	margin-right:10px;
	width: 300px;
	height: 30px;
	float: left;

}
.couresSelectStyle .el-select{
	width: 110px;

}



.couresSelectStyle .el-input__inner{
		border:1px solid #448db8;
	}
.couresSelectStyle .el-input__inner::placeholder{
		color: white;
	}
.couresSelectStyle .el-input-group__append, .el-input-group__prepend{
		color: white;
		background-color: #448db8;
		border:none;
	}
.couresSelectStyle .el-select .el-input .el-select__caret{
		color:white;
	}*/
</style>