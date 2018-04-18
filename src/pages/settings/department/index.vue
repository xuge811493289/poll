<!-- 方向模块 -->
<template>
	<div class="department">
		<div class="options">
		  	<el-input clearable size="small" placeholder="请输入内容" v-model="key" class="input-with-select">
			     <el-select v-model="selectKey" slot="prepend" placeholder="请选择" id="changColor">
			      <el-option label="名称" value="name"></el-option>
			      <el-option label="描述" value="description"></el-option>
			      <el-option label="所属部门" value="belongName"></el-option>
			    </el-select>
			    <el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>
		  	<el-button type="success" icon="el-icon-plus" size='mini' @click='toAdd'>添加</el-button>
		  	<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDelete'>批量删除</el-button>
		</div>
		<div class="tblData">
		 <el-table height="476" ref="table" :data="directionsList" style="width: 100%" size='mini' :border='tblBorder' @row-click="toggleSelection" @selection-change="handleSelectionChange">
		  <el-table-column align="center" type="selection"	width="55"> </el-table-column>
	      <el-table-column align="center" prop="name" label="名称"> </el-table-column>
	      <el-table-column align="center" prop="description" label="描述"> </el-table-column>
	      <el-table-column align="center" prop="belongName" label="所属部门"> </el-table-column>
	      <el-table-column align="center" label="操作" width="100">
		      <template slot-scope="scope">
		        <i class="fa fa-edit" title="编辑" @click="toEdit(scope.$index, scope.row)"></i>
		        <i class="fa fa-trash-o" title="删除" style="color:#f56c6c" @click="handleDelete(scope.$index, scope.row)"></i>
		      </template>
		  </el-table-column>
	     </el-table>	
		</div>
		<!-- 添加方向的模态框 -->
		<el-dialog center :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		  <el-form :model="form" :rules="rules" ref="form">
		    <el-form-item prop="name" label="方向名称" :label-width="formLabelWidth">
		      <el-input clearable v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item  prop="description" label="方向描述" :label-width="formLabelWidth">
		      <el-input type='textarea' v-model="form.description" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item  prop="department" label="所属部门" :label-width="formLabelWidth">
		    	<el-select v-model="form.department" placeholder="请选择">
			    	<el-option v-for="department in departments" :key="department.id" :label="department.name" :value="department.id">
			    	</el-option>
			  	</el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="handleCancel">取 消</el-button>
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
				key:'',
				selectKey:'',
				tblBorder:true,
				dialogFormTitle:'添加方向信息',
				dialogFormVisible:false,
				formLabelWidth:'120px',
				form:{
					name:'',
					description:'',
					department:null
				},
				multipleSelection:[],	//复选框多选
				rules:{
					name:[
						{ required: true, message: '请输入方向姓名', trigger: 'blur' },
					],
					description:[
						{ required: true, message: '请输入方向描述', trigger: 'blur' }
					],
					department:[
						{ required: true, message: '请选择部门', trigger: 'change' }
					]
				}
			}
		},
		//映射数据
		computed:{
			//过滤显示 通过名字，描述，部门过滤方向
			directionsList:function(){
				let vm = this;
				return this.directions.filter((item)=>{
					if(vm.selectKey){
						return item[vm.selectKey].indexOf(vm.key)!=-1;
					}else{
						return vm.directions;
					}
				});
			},
			...mapGetters(['departments','directions'])
		},
		//初始化数据
		created(){
			//查找所有一级部门
			this.findAllDepartments();
			//查找所有二级方向
			this.findAllDirections();
		},
		methods:{
			//选择表格行被点击的时候触发
			toggleSelection(row,event,column){
				this.$refs.table.toggleRowSelection(row);
		    },
			handleSelectionChange(val) {
	        	this.multipleSelection = val;
	      	},
			//跳转到添加页面（弹出模态框）
			toAdd(){
				this.form = {};
				this.dialogFormTitle = "添加方向信息";
				this.dialogFormVisible = true;
			},
			//确认提交
			handleSubmit(form){
				this.$refs[form].validate((valid) => {
			        if (valid) {
			            this.saveDepartment(this.form).then((result)=>{
							this.$message({type: 'success', message: '操作成功!'});
		          			//关闭模态框并更新数据
							this.handleCancel();
						}).catch((error)=>{
							this.$message({type: 'info', message: '操作失败!'});

						});
			        } else {
			            return false;
			        }
		        });
			},
			//取消
			handleCancel(){
				this.dialogFormVisible = false;
				this.findAllDirections();
			},
			//更新
			toEdit(index,row){
				this.dialogFormTitle = "修改方向信息";
				this.form.name = row.name;
				this.form.description = row.description;
				this.form.id = row.id;
				this.form.department = row.belongId;
				this.dialogFormVisible = true;
			},
			//删除
			handleDelete(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.batchDeleteDepartment(row.id).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		this.findAllDirections();
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
			        	this.batchDeleteDepartment(ids).then(()=>{
			        		this.$message({type: 'success', message: '删除成功!'});
			        		this.findAllDirections();
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
				'findAllDepartments',
				'findAllDirections',
				'saveDepartment',
				'batchDeleteDepartment'
				
			])
		}
	}
</script>