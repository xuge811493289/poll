<!-- 问卷模板页面 -->
<template>
	<div class="myLesson">
		
			<div class="tblData">
				<el-table :data="myLessons" ref="table" @row-click="toggleSelection" style="width: 100%" size='mini' :border='tblBorder'>
					<el-table-column type="selection"	width="55"> </el-table-column>
		      		<el-table-column align="center" prop="teacherName"label="教师名称">	 </el-table-column>
		      		<el-table-column align="center" prop="questionName"label="问卷名称"> </el-table-column>
		      		<el-table-column align="center" prop="lessonName"label="课程名称"> </el-table-column>
		      		<el-table-column align="center" prop="type"label="课程类型"> </el-table-column>
		      		<el-table-column align="center" prop="clazzName"label="班级名称"> </el-table-column>
		      		<el-table-column align="center" prop="date"label="课调日期"> </el-table-column>
		      		
		      		<el-table-column align="center" label="详情" width="100">
				      <template slot-scope="scope">
				        <i class="fa fa-eye" title="查看" style="color:#67C23A" @click="toSee(scope.$index, scope.row)" ></i>
				        <router-link title='柱状图' tag="a" :to="{path:'/reports/lessonReport',query:{questionId:scope.row.questionId,questionName:scope.row.questionName}}" @click.native='toCharge(scope.row)' class="fa fa-bar-chart" style="color:#FFDD5F;text-decoration:none">
			          
			        	</router-link>
				     
				      </template>
			    	</el-table-column>
		    	</el-table>	
			</div>
		
		<!-- 显示的模态框 -->
		<el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
		 <el-form :model="form" class='elForm'>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv'>教师名称</div>
		     <el-input v-model="form.teacherName" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv'>问卷名称</div>
		     <el-input v-model="form.questionName" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv'>课程名称</div>

		     <el-input v-model="form.lessonName" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv'>课程类型</div>
		     <el-input v-model="form.type" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv' >班级名称</div>
		     <el-input  v-model="form.clazzName" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv' >课调日期</div>
		     <el-input v-model="form.date" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv'>总份数</div>
		     <el-input v-model="form.totalNumber" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>
		   	<div class='leftDiv'>有效份数</div>
		     <el-input v-model="form.validNumber" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>
		   <el-form-item :label-width="formLabelWidth" class='formItem'>

		   	<div class='leftDiv'>平均分</div>
		     <el-input v-model="form.average" readonly auto-complete="off" class='formInputWidth'></el-input>
		   </el-form-item>

		    <el-form-item :label-width="formLabelWidth" class='formItem'>
		    	
		    	<div class='leftDiv'>详情</div>
		     <el-input type='textarea' readonly v-model="form.remarks" auto-complete="off" class='formText'></el-input>
		   </el-form-item>
		 </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' type="primary" @click="handleCancel">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import {mapGetters,mapActions,mapMutations} from 'vuex';
	import lessonReportStore from '../../../store/modules/lessonReportStore'
/*const routes = [
 { path: '/1', component: lessonReportStore } 
 //前面to指定的地方 path /1
]*/

	export default {
	
		data(){
			return {
				tblBorder:true,
				dialogFormTitle:'课调详情',
				dialogFormVisible:false,
				formLabelWidth:'100px',
				form:{}
			}
		},
		//映射数据
		computed:{
			...mapGetters(['myLessons'])
		},
		created(){
			this.findAllMyLessons();
		},
		methods:{
			toCharge(i){
				//
			},
			toggleSelection(row,event,column){
		      	this.$refs.table.toggleRowSelection(row);
		      },
			//预览问卷
			toSee(index,row){
				this.dialogFormVisible = true;
				
				var endArr="";
				//row.remarks代表后台查出来的所有主观题答案封装成的数组，数组中对象个数代表主观题个数
				for(var i=0;i<row.remarks.length;i++){
					var newArr='';
					newArr+="第"+ (i+1) +"道主观题\n";
					var anserArr=row.remarks[i].content.split("&");
					
					for(var j=0;j<anserArr.length;j++){

						newArr+="   "+(j+1)+"."+anserArr[j]+'\n';
					}
				
					endArr+=newArr;
					
				}

					
					this.form={
					teacherName:row.teacherName,
					questionName:row.questionName,
					lessonName:row.lessonName,
					type:row.type,
					clazzName:row.clazzName,
					date:row.date,
					totalNumber:row.totalNumber,
					validNumber:row.validNumber,
					average:row.average,//平均分
					remarks:endArr
				}
				
			},
		
			//模态框取消
			handleCancel(){
				this.dialogFormVisible = false;
			},
			
			
		    //映射Store中的方法
		    ...mapActions([
				'findAllMyLessons'
				
			]),
		}
	}
</script>
<style>
	/*i.fa {
		cursor: pointer;
	}
	.tblData thead th{
		background-color: #e1e1e1;
	}
	.options {
		text-align: right;
		margin-bottom: 2px;
	}*/




.formInputWidth{
	width: 150px;
	margin-left:-10px;
}
.formItem{
	float:left;
}
.elForm{
	overflow: hidden;
}
.formText{
	width: 630px;
	margin-left: -10px
}

.leftDiv{
	float:left;
	width:70px;
	margin-left:-80px
}





	 
</style>