<!-- 创建问卷页面 二级 -->
<template>
	<div class="createQuestinnaire">
		<div class="form">
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
			  <el-form-item label="问卷名称" prop="name">
			    <el-input clearable v-model="form.name"></el-input>
			  </el-form-item>
			  <el-form-item label="问卷作用" prop="role">
			    <el-input type='textarea' v-model="form.role"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
			    <el-button @click="form={}">取消</el-button>
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
				form:{},
				rules:{
					name:[
						{ required: true, message: '请输入问卷名称', trigger: 'blur' },
					],
					role:[
						{ required: true, message: '请输入问卷作用', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			// 创建问卷
			onSubmit(form){
				this.$refs[form].validate((valid) => {
			        if (valid) {
			            this.saveQuestinnaires(this.form).then(()=>{
							//创建成功之后的提示
							this.$message({message:'添加问卷成功，请添加题目信息',type: 'success'});
							// 点击下一步按钮
							document.getElementsByClassName('bottomNav')[0].children[0].click();
							this.form = {};
						}).catch((error)=>{
							this.$message({type: 'info', message: '添加问卷失败'});
							// console.log(error);
						});
			        } else {
			            return false;
			        }
		        });
			},
			//vuex映射的动作
			...mapActions([
				'setBottomNavShow',
				'saveQuestinnaires',
			])
		}
	}
</script>