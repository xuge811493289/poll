<!-- 预览问卷页面 二级 -->
<template>
	<div class="previewQuestionnaire">
		<h2>{{queInfo.name}}</h2>
		<el-form ref="form" label-width="80px">
			<div>
				<ol>
					<h3>一.单选题目</h3>
					<li v-for="radioSub in radioSubjects">
						{{radioSub.name}}
						<!-- 选择的选项 -->
						<div>
							<el-radio-group v-model="radioSub.answer">
								<div  v-for="ch in radioSub.choice">
									<el-radio :label="ch.id">{{ch.content}}</el-radio>
								</div>
							</el-radio-group>
						</div>
					</li>
					<h3>二.多选题目</h3>
					<li v-for="checkSub in checkboxSubjects">
						{{checkSub.name}}
						<!-- 选择的选项 -->
						<div>
							<!-- 这里的checkSub.answer需要为数组才行 -->
							<el-radio-group v-model="checkSub.answer">
								<div  v-for="ch in checkSub.choice">
									<el-checkbox :label="ch.id">{{ch.content}}</el-checkbox>
								</div>
							</el-radio-group>
						</div>	
					</li>
					<h3>三.简答题</h3>
					<li v-for="simpleSub in simpleSubjects">
						{{simpleSub.name}}
						<el-input
						  type="textarea"
						  :autosize="{ minRows: 2, maxRows: 4}"
						  placeholder="请输入内容"
						  v-model="simpleSub.answer">
						</el-input>
					</li>
				</ol>
			</div>
		</el-form>
	</div>
</template>
<style>
	h2{
		background-color: #409EFF;
		text-align: center;
		line-height: 40px;
	}
	h3{
		margin-left:-40px;
	}
	li{
		line-height: 30px;
	}
</style>
<script>
	import {mapGetters,mapActions} from 'vuex';
	export default {
		data(){
			return {
				form:{}
			}
		},
		created(){
			this.queryQuestionnaireById(this.queId);
		},
		computed:{
			...mapGetters(['queId','queInfo','radioSubjects','checkboxSubjects','simpleSubjects'])
		},
		methods:{
			...mapActions([
				'queryQuestionnaireById'
			])
		}
	}
</script>