<!-- 添加题目页面 二级 -->
<template>
	<div class="addSubject">
		<div class="form">
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="题目类型" prop="subjectType">
		    		<el-select v-model="form.subjectType" placeholder="请选择">
				    	<el-option v-for="subType in subTypes" :key="subType.key" :label="subType.value" :value="subType.value">
				    	</el-option>
				  	</el-select>
			    </el-form-item>
			  	<el-form-item label="题目名称" prop="name">
			    	<el-input clearable v-model="form.name" placeholder="请输入题目名称"></el-input>
			  	</el-form-item>
			    <!-- 单选/多选选项区域 :rules="{
					      required: true, message: '选项不能为空', trigger: 'blur'
					    }"-->
			    <div class="chioceArea" v-show="chioceAreaShow">
			    	<el-form-item v-for="(option,index) in form.options" :label="'选项' + (index+1)" :key="option.key">
					    <el-col :span="16">
			    			<el-form-item>
			    				<el-input clearable v-model="option.value" placeholder="请输入选项内容"></el-input>
			    			</el-form-item>
			    	    </el-col>
				    	<el-col :span="6">
			    			<el-form-item>
				    			<el-input-number v-model="option.score" :min="1" :max="5"></el-input-number>
				    		</el-form-item>
				    	</el-col>
				    	<el-col :span="2"><el-button type="danger" @click.prevent="removeOption(option)">删除</el-button></el-col>
					</el-form-item>
			    </div>
			    <el-form-item>
			    	<el-button v-show="chioceAreaShow" type="primary" @click="addOption">新增选项</el-button>
				    <el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
				    <el-button @click="form={}">取消</el-button>
				    <el-button type="primary" @click="onFinish('form')">完成</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	export default {
		data(){
			return {
				optionLabel:['A','B','C','D','E','F','G','H'],
				form:{
					options:[{
						option:'',
						score:1,
						value:''
					},{
						option:'',
						score:1,
						value:''
					}]
				},
				// 表单验证
				rules:{
					subjectType:[
						{ required: true, message: '请选择题目类型', trigger: 'change' },
					],
					name:[
						{ required: true, message: '请输入题目题干', trigger: 'blur' },
					]
				}
			}
		},
		//映射数据
		computed:{
			chioceAreaShow(){
				if(this.form.subjectType){
					if(this.form.subjectType==="简答"){
						return false;
					}else{
						return true;
					}
				}
				return false;
			},
			...mapGetters(['queId','subTypes'])
		},
		//初始化数据
		created(){
			this.queryAllSubjectTypes();
			this.setBottomNavShow(false);
		},
		methods:{
			addOption(){
				this.form.options.push({
		          	option:'',
					score:1,
					value:''
		        });
			},
			removeOption(option){
				let index = this.form.options.indexOf(option);
		        if (index !== -1) {
		          this.form.options.splice(index, 1);
		        }
			},
			onFinish(form){
				if(this.form.name){
					this.onSubmit(form);
				}
				// 点击下一步
				document.getElementsByClassName('bottomNav')[0].children[1].click();
			},
			onSubmit(form){
				this.$refs[form].validate((valid) => {
			        if (valid) {
			            //处理单选和多选按钮
						if(this.form.subjectType!=="简答"){
							//将多个选项组合成字符串传递给后台
							let choices = '';
							let vm = this;
							//处理为后台需要的数据
							this.form.options.forEach(function(item,index){
								item.option = vm.optionLabel[index];
								if(item.value){
									let temp = '';
									for(let key in item){
										temp += item[key]+':';
									}
									choices += temp+';';
								}
							});
							this.form.choices = choices;
						}
						this.form.queId = this.queId;
						//store中的数据
						this.saveSubjects(this.form).then((result)=>{
							this.$message({type: 'success', message: '添加题目成功!添加完成点击【完成】'});
							//清空表单
							this.form = {
								options:[{
									option:'',
									score:1,
									value:''
								},{
									option:'',
									score:1,
									value:''
								}]
							};
						}).catch((error)=>{
							this.$message({type: 'info', message: '添加题目失败'});
						});
			        } else {
			            return false;
			        }
		        });
				
			},
			...mapActions([
				'queryAllSubjectTypes',
				'setBottomNavShow',
				'saveSubjects'
			])	
		}

	}
</script>
<style>
	.addSubject .el-select .el-input .el-select__caret{
	  color:#aaaaaa;
	}
</style>