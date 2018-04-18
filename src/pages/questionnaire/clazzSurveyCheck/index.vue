<!-- 课调审核页面 -->
<template>
	<div class="clazzSurveyChecks">
		<div class="options ownTop">
			<el-input clearable size="small" placeholder="请输入内容" v-model="key" class="input-with-select ownTopSelect">
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
		</div>
		<div class="tblData ownTable">
			<el-table height="476" ref="table" @row-click="toggleSelection" :data="surveysList" style="width: 100%" size='mini' :border='tblBorder'>
				<el-table-column align="center" type="selection" width="55"> </el-table-column>
		      	<el-table-column align="center" prop="teacher.realname" label="教师名称"> </el-table-column>
		      	<el-table-column align="center" prop="course.name" label="课程名称"> </el-table-column>
		      	<el-table-column align="center" prop="clazz.name" label="班级名称"> </el-table-column>
		      	<el-table-column align="center" prop="questionnaire.name" label="问卷模板"> </el-table-column>
		      	<el-table-column align="center" prop="status" label="课调状态"> </el-table-column>
		      	<el-table-column align="center" prop="date" label="课调日期"  width="155"> </el-table-column>
		      	<el-table-column align="center" prop="random" label="课调编号"> </el-table-column>
		      	<el-table-column align="center" label="操作" width="100">
			      	<template slot-scope="scope">
			        	<i class="fa fa-gavel" style="color:#F56C6C" title="审核" @click="toCheckSurvey(scope.$index, scope.row)"></i>
			      	</template>
			    </el-table-column>
		    </el-table>	
		</div>
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
				formLabelWidth:'260px',
			}
		},
		//映射数据
		computed:{
			// 获取已经结束的课调，或者审核通过的课调
			surveysDone:function(){
				let vm = this;
				if(this.surveys&&this.surveys.length>0){
					return this.surveys.filter((item)=>{
						return item.status.indexOf('待审核')!=-1;
					});
				}else{
					return null;
				}		
			},
			//过滤显示 通过教师名称，班级名称，课程名称，课调日期、课调状态、课调编号等过滤课调
			surveysList:function(){
				let vm = this;
				// 过滤筛选
				return this.surveysDone.filter((item)=>{
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
			},
			...mapGetters(['surveys'])
		},
		//初始化数据
		created(){
			this.findAllSurveys();
		},
		methods:{
			toggleSelection(row,event,column){
				this.$refs.table.toggleRowSelection(row);
		    },
			toCheckSurvey(index,row){
				//保存课调信息,传参数给store
				this.SaveSurveyInfo(row);
				//通过课调id查找所有答卷信息
				this.findChoiceBySurveyId(row.id).then((result)=>{
					//设置路由
					this.$router.push('/questionnaire/clazzSurveyCheckOne');
				}).catch((error)=>{
					console.log(error);
				});
			},
			//vuex映射的动作
			...mapActions([
				'findAllSurveys',
				'findChoiceBySurveyId',
				'SaveSurveyInfo'
			])
		}
	}
</script>
<style>
	.ownTop{
		margin-top:-2px;
	}
	.ownTopSelect{
		margin-bottom:2.5px;
	}
</style>