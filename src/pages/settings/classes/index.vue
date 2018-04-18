<template>
	<div class="classes">
		<div class="options classSelectStyle">
			<!-- <div class="searchDiv"> -->
				<el-input size="small" placeholder="请输入内容" v-model="searchInput" class="input-with-select">
				    <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
				      <el-option label="名称" value="name"></el-option>
				      <el-option label="班主任" value="charge"></el-option>
				      <el-option label="所属方向" value="department"></el-option>
				    </el-select>
				    <el-button slot="append" icon="el-icon-search" @click='toSearchByKey'></el-button>
				</el-input>
			<!--  </div> -->
			
				<!-- <el-input
							    placeholder="请输入要搜索的关键字"
							    v-model="searchKey" style="width:300px" size="small">
							    <i slot="prefix" class="el-input__icon el-icon-search"></i>
							  </el-input> -->
			<!-- <el-button type="primary" icon="el-icon-search" size='mini' @click='toSearchByKey'>搜索</el-button> -->
		
			<el-button type="success" icon="el-icon-plus" size='mini' @click='toAdd'>添加</el-button>
			<el-button type="danger" icon="el-icon-delete" size='mini' @click='handleBatchDelete'>批量删除</el-button>
		</div>
		<div class="tblData">
			<el-table :data="classList"style="width: 100%" ref="table" size='mini' :border='tblBorder' @row-click="toggleSelection" @selection-change="handleSelectionChange">
				<el-table-column type="selection"	width="55"> </el-table-column>
	      <el-table-column align="center" prop="name"label="名称"> </el-table-column>
	      <el-table-column align="center" prop="beginDate"label="开班时间"> </el-table-column>
	      <el-table-column align="center" prop="charge.name"label="班主任"> </el-table-column>
	     
	      <el-table-column align="center" prop="department.name"label="所属方向"> </el-table-column>
	      <!-- <el-table-column prop="departmentId" style="display:none"> </el-table-column> -->
	      <el-table-column align="center" prop="studentNum"label="班级人数"> </el-table-column>
	      <el-table-column align="center" prop="area"label="所属区域"> </el-table-column>
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
		  <el-form :model="formClass" :rules="rules" ref="formClass">
		    <el-form-item label="班级名称" :label-width="formLabelWidth" prop='name'>
		      <el-input v-model="formClass.name" auto-complete="off"></el-input>
		    </el-form-item>
		   <!--  <el-form-item label="开班时间" :label-width="formLabelWidth" prop='beginDate'>
		     <el-input v-model="formClass.beginDate" auto-complete="off" placeholder="请按照 1990-09-09 格式输入"></el-input>
		   </el-form-item> -->

			 <el-form-item prop="beginDate" label="开班时间" :label-width="formLabelWidth">
		        <el-date-picker type="date" placeholder="请选择日期" v-model="formClass.beginDate" auto-complete="off" style="width: 100%;"></el-date-picker>
		      </el-form-item>
		    </el-col>

		    <el-form-item label="班主任" :label-width="formLabelWidth" prop='charge'>

		    	<el-select v-model="formClass.charge" placeholder="请选择">
			    <el-option
			      v-for="charge in charges"
			      :key="charge.id"
			      :label="charge.realname"
			      :value="charge.id">
			    </el-option>
			  </el-select>
		      <!-- <el-input v-model="form.charge" auto-complete="off"></el-input>
		      <el-input v-model="form.chargeId" auto-complete="off" style="display:none"></el-input> -->
		    </el-form-item>
		    <el-form-item label="所属方向" :label-width="formLabelWidth" prop='department'>

		    	  <template slot-scope="scope">
				    	<el-select v-model="formClass.department" placeholder="请选择">
					    <el-option
					      v-for="dep in departmentt"
					      :key="dep.id"
					      :label="dep.name"
					      :value="dep.id">
					    </el-option>
					  </el-select>
					</template>
		      <!-- <el-input v-model="form.department" auto-complete="off"></el-input>
		      <el-input v-model="form.departmentId" auto-complete="off" style="display:none"></el-input> -->
		    </el-form-item>
		     <el-form-item label="班级人数" :label-width="formLabelWidth" prop='studentNum'>
		      <el-input v-model="formClass.studentNum" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="所属区域" :label-width="formLabelWidth" prop='area'>
		      <el-input type='textarea' v-model="formClass.area" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click="handlerquxiao">取 消</el-button>
		    <el-button size='mini' type="primary" @click="handleSubmit('formClass')">确 定</el-button>
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
				dialogFormTitle:'添加班级信息',
				dialogFormVisible:false,
				formLabelWidth:'120px',
				departmentt:[],
				formClass:{
					name:null,
					department:null,
					charge:null,
					beginDate:null
				},
				searchKey:'',
				searchInput:'',
				multipleSelection:[],	//复选框多选
				rules:{
					name:[
						{ required: true, message: '请输入班级名称', trigger: 'blur' },
            			{ min: 3, max: 12, message: '长度在 3到 12 个字符', trigger: 'blur' }
					],
					beginDate:[
						{type: 'date', required: true, message: '请选择日期', trigger: 'change'}
					],
					charge:[
						{ required: true, message: '请选择班主任', trigger: 'change' }
					],
					studentNum:[
						{ required: true, message: '请输入班级人数', trigger: 'blur' }
					],
					area:[
						{ required: true, message: '请输入区域', trigger: 'blur' }
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
			classList:function(){
				var vm = this;
				return this.classes.filter((item)=>{
					if(vm.searchKey){
						if(vm.searchKey==='name'){
							return item.name.indexOf(vm.searchInput)!=-1;
						}
						return item[vm.searchKey].name.indexOf(vm.searchInput)!=-1;
					}else{
						return vm.classes;
					}
				});
				
			},
			...mapGetters(['classes','department','charges'])
		},
		//初始化数据
		created(){
			this.findAllClasses();
			this.findAllDepartment().then(()=>{
				this.departmentt=this.department.filter(function(item){
					return item.belongId;//模态框的下拉框中展示所有具有部门id belongId 的方向
				});
			});
			this.findAllCharges();
		
		},
		methods:{
			toggleSelection(row,event,column){
		      	this.$refs.table.toggleRowSelection(row);
		      },
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		      },
		    
	      //根据关键字进行搜索
			toSearchByKey(){
				/*alert(this.searchKey);
				alert(this.searchInput);*/
				let searchObj={
					param:this.searchKey,
					value:this.searchInput
				}
				this.searchByKey(searchObj);
			},
			//跳转到添加页面（弹出模态框）
			toAdd(){

				/*this.findAllClasses();
				this.findAllDepartment();//获取所有部门信息
				this.findAllCharges();//获取所有班主任信息
*/

				this.dialogFormTitle="添加班级信息";
				this.dialogFormVisible = true;
				this.formClass={};

				
			},
			handlerquxiao(){
				this.dialogFormVisible = false;
				this.findAllClasses();
			},
			
			//确认提交
			handleSubmit(formName){

				if(this.formClass.id){
					//修改
					
					
					//判断当前用户在修改时是否 修改了开始时间，不等于string类型时为修改
					if(typeof this.formClass.beginDate !='string'){
						this.formClass.beginDate.setDate(this.formClass.beginDate.getDate()+1);
						
					}else{
						var changeDate=new Date(this.formClass.beginDate).setDate(new Date(this.formClass.beginDate).getDate());
						this.formClass.beginDate=new Date(changeDate);
						
						
					}

					

					this.a={
					  	id:this.formClass.id,
						name:this.formClass.name,
						beginDate:this.formClass.beginDate,
						studentNum:this.formClass.studentNum,
						/*'charge.id':this.formClass.chargeId,*/
						/*'department.id':this.formClass.departmentId,*/
						area:this.formClass.area

					};

					if(Number(this.formClass.charge)){
						this.a['charge.id']=this.formClass.charge;
					}else{
						this.a['charge.id']=this.formClass.chargeId;
					}

					if(Number(this.formClass.department)){
						this.a['department.id']=this.formClass.department;
					}else{
						this.a['department.id']=this.formClass.departmentId;
					}
					
					//this.formClass.charge=this.formClass.chargeId;

					
				}else{
					//添加
					this.formClass.beginDate.setDate(this.formClass.beginDate.getDate()+1);
					this.a={
					  	id:this.formClass.id,
						name:this.formClass.name,
						beginDate:this.formClass.beginDate,
						studentNum:this.formClass.studentNum,
						'charge.id':this.formClass.charge,
						'department.id':this.formClass.department,
						area:this.formClass.area

					};

					
				}

				 this.$refs[formName].validate((valid) => {
		          if (valid) {
		            this.saveClasses(this.a).then((result)=>{
								this.$message({type: 'success', message: '操作成功!'});
			          //关闭模态框
								this.dialogFormVisible = false;
								this.findAllClasses();
							}).catch((error)=>{
								console.log(error);
							});

		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });



		/*		
			var r1=/\d{4}-\d{2}-\d{2}/;//判断日期格式的正则表达式
				if(this.a.name!=undefined && this.a.beginDate!=undefined && r1.test(this.a.beginDate) && this.a['charge.id']!=undefined && this.a['department.id']!=undefined && this.a.studentNum!=undefined && Number(this.a.studentNum)&& this.a.area!=undefined){
						
				}else{
					console.log('不符合输入条件');
				}
				*/
				
				
			},
			//更新
			toEdit(index,row){
				/*this.findAllDepartment();
				this.findAllCharges();*/
				
				this.dialogFormTitle="修改班级信息";
				this.formClass.name = row.name;
				this.formClass.beginDate=row.beginDate;
				this.formClass.area = row.area;
				this.formClass.studentNum = row.studentNum;
				this.formClass.id = row.id;
				this.formClass.department=row.department.name;
				this.formClass.departmentId=row.department.id;
				this.formClass.charge=row.charge.name;
				this.formClass.chargeId=row.charge.id;

				this.dialogFormVisible = true;


			},
			//删除
			handleDelete(index,row){
				this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        	this.batchDeleteClasses(row.id).then(()=>{
        		this.findAllClasses();
        		this.$message({type: 'success', message: '删除成功!'});
        		
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
		        	this.batchDeleteClasses(ids).then(()=>{
		        		this.$message({type: 'success', message: '删除成功!'});
		        		this.findAllClasses();
		        	}).catch(()=>{
		        		this.$message({type: 'info', message: '删除失败!'});
		        	});
		          this.$message({type: 'success', message: '删除成功!'});
		          this.findAllClasses();
		        }).catch(() => {
		          this.$message({type: 'info', message: '已取消删除'});
		        });
        	}else{
        		this.$message({type: 'info', message: '请选择要删除的信息'});
        	}
				
			},
			//vuex映射的动作
			...mapActions([
				'findAllClasses',
				'saveClasses',
				'batchDeleteClasses',
				'findAllDepartment',
				'findAllCharges',
				'searchByKey'
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
/* 	.searchDiv{
	float: left
} */

/*	.classSelectStyle .input-with-select{
	margin-right:10px;
	width: 300px;
	height: 30px;
	float: left
}
.classSelectStyle .el-select{
	width: 110px;

}

.classSelectStyle .el-input__inner{
		border:1px solid #448db8;
	}
	.classSelectStyle .el-input__inner::placeholder{
		color: white;
	}
	.classSelectStyle .el-input-group__append, .el-input-group__prepend{
		color: white;
		background-color: #448db8;
		border:none;
	}
.classSelectStyle .el-select .el-input .el-select__caret{
		color:white;
	}*/
</style>