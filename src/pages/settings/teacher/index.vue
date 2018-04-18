<!-- teacher页面 -->
<template>
	<div class="teachers">
		<div class="options">
			<el-input clearable size="small" placeholder="请输入内容" v-model="key" class="input-with-select">
			    <el-select v-model="selectKey" slot="prepend" placeholder="请选择">
			      <el-option label="名称" value="realname"></el-option>
			      <el-option label="描述" value="description"></el-option>
			      <el-option label="所属方向" value="department.name"></el-option>
			      <el-option label="类型" value="type"></el-option>
			    </el-select>
			    <el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>
			<el-button type="success" icon="el-icon-plus" size='mini' @click='toAdd'>添加</el-button>
			<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDelete'>批量删除</el-button>
		</div>
		<div class="tblData">
			<el-table height="476" ref="table" :data="teachersList" style="width: 100%" size='mini' :border='tblBorder' @row-click="toggleSelection" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"> </el-table-column>
		      	<el-table-column align="center" prop="realname" label="名称"> </el-table-column>
		      	<el-table-column align="center" prop="description" label="描述"> </el-table-column>
		      	<el-table-column align="center" prop="department.name" label="所属方向"> </el-table-column>
		      	<el-table-column align="center" prop="type" label="类型"> </el-table-column>
		      	<el-table-column align="center" label="操作" width="100">
			      	<template slot-scope="scope">
			        	<i class="fa fa-edit" @click="toEdit(scope.$index, scope.row)" title="编辑"></i>
			        	<i class="fa fa-trash-o danger" title="删除" style="color:#f56c6c" @click="handleDelete(scope.$index, scope.row)"></i>
			      	</template>
			    </el-table-column>
		    </el-table>	
		</div>
		<!-- 添加教师的模态框 -->
		<el-dialog center :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		  <el-form :model="form" :rules="rules" ref="form">
		    <el-form-item label="教师名称" prop="realname" :label-width="formLabelWidth">
		      <el-input clearable v-model="form.realname" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="教师密码"  prop="password" :label-width="formLabelWidth">
		      <el-input clearable type="password" v-model="form.password" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="教师描述"  prop="description" :label-width="formLabelWidth">
		      <el-input type='textarea' v-model="form.description" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="教师类型"  prop="type" :label-width="formLabelWidth">
		      	<el-select v-model="form.type" placeholder="请选择">
		      		<!-- 这里的type.val可相当于id -->
			    	<el-option v-for="type in types" :key="type.val" :label="type.name" :value="type.val">
			    	</el-option>
			    </el-select>
		    </el-form-item>
		    <el-form-item label="所属方向"  prop="department" :label-width="formLabelWidth">
		    	<el-select v-model="form.department" placeholder="请选择">
			    	<el-option v-for="direction in directions" :key="direction.id" :label="direction.name" :value="direction.id">
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
				value:'',
				tblBorder:true,
				dialogFormTitle:'添加教师信息',
				dialogFormVisible:false,
				formLabelWidth:'120px',
				form:{
					//为了解决select无效的问题
					department:null,
					type:null
				},
				multipleSelection:[],	//复选框多选
				rules:{
					realname:[
						{ required: true, message: '请输入教师姓名', trigger: 'blur' },
            			{ min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' },
            			{ min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
					],
					description:[
						{ required: true, message: '请输入教师描述', trigger: 'blur' }
					],
					type:[
						{ required: true, message: '请选择教师类型', trigger: 'change' }
					],
					department:[
						{ required: true, message: '请选择方向', trigger: 'change' }
					]
				}
			}
		},
		//映射数据
		computed:{
			//过滤显示 通过名字，描述，部门过滤方向
			teachersList:function(){
				let vm = this;
				return this.teachers.filter((item)=>{
					if(vm.selectKey){
						if(vm.selectKey==='department.name'){
							return item.department.name.indexOf(vm.key)!=-1;
						}
						return item[vm.selectKey].indexOf(vm.key)!=-1;
					}else{
						return vm.teachers;
					}
				});
			},
			...mapGetters(['teachers','directions','types'])
		},
		//初始化数据
		created(){
			this.findAllTeachers();
			this.findAllTeacherTypes();
			this.findAllDirections();
		},
		methods:{
			//选择表格行被点击的时候触发
			toggleSelection(row,event,column){
				// 切换选中状态
				this.$refs.table.toggleRowSelection(row);
		    },
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
			//跳转到添加页面（弹出模态框）
			toAdd(){
				this.form={};
				this.dialogFormTitle = "添加教师信息";
				this.dialogFormVisible = true;
			},
			//取消
			handleCancel(){
				this.dialogFormVisible = false;
				this.findAllTeachers();
			},
			//确认提交
			handleSubmit(form){
				this.$refs[form].validate((valid) => {
			        if (valid) {
			        	if(this.form.type==="admin"){
							this.form.type = 0;
						}else if(this.form.type==="teacher"){
							this.form.type = 1;
						}
			            this.saveTeachers(this.form).then((result)=>{
							this.$message({type: 'success', message: '操作成功!'});
							//关闭并更新数据
		          			this.handleCancel();
						}).catch((error)=>{
							this.$message({type: 'info', message: '操作失败!'});
						});
			        } else {
			            return false;
			        }
		        });
			},
			//更新
			toEdit(index,row){
				this.dialogFormTitle = "修改教师信息";
				this.form.realname = row.realname;
				this.form.password = row.password;
				this.form.description = row.description;
				this.form.id = row.id;
				this.form.type = row.type;
				if(row.department){
					this.form.department = row.department.id;
				}
				this.dialogFormVisible = true;
			},
			//删除
			handleDelete(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.batchDeleteTeachers(row.id).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		this.findAllTeachers();
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
			        	this.batchDeleteTeachers(ids).then(()=>{
			        		this.$message({type: 'success', message: '删除成功!'});
			        		this.findAllTeachers();
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
				'saveTeachers',
				'batchDeleteTeachers',
				'findAllTeacherTypes',
				'updateTeachers',
				'findAllDirections'
			])
		}
	}
</script>