<!-- 问卷主页面 一级-->
<template>
	<div class="questionnaire">
		<el-steps :active="active" align-center>
		  <el-step title="创建问卷" icon="el-icon-setting" description="创建一个新的问卷"></el-step>
		  <el-step title="添加题目" icon="el-icon-edit" description="为问卷添加题目"></el-step>
		  <el-step title="预览" icon="el-icon-view" description="展现问卷最终展现形式"></el-step>
		</el-steps>
		<!-- 内容区 -->
		<div class="content-block">
			<!-- 路由显示区 -->
			<router-view></router-view>
		</div>
		<!-- 内容区结束 -->
		<!-- 底部导航 -->
		<div class="bottomNav" v-show="bottomNavShow">
			<el-button v-if='this.active !== 1' size='small' type="primary" style="margin-top: 12px;" @click="prev">
				<i class="el-icon-arrow-left">上一步</i>
			</el-button>
			<el-button  v-if='this.active !== 3' size='small' type="primary" style="margin-top: 12px;" @click="next">
				下一步<i class="el-icon-arrow-right el-icon--right"></i>
			</el-button>
		</div>
	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	export default {
		data() {
      		return {
        		active: 1,
        		form:null
      		};
    	},
    	created(){
    		//设置下一步不显示
    		this.setBottomNavShow(false);
    	},
	    computed:{
	    	//按钮上的文字描述
	    	btnNext(){
	    		if(this.active == 2){
	    			return '保存并添加下一个'
	    		} else {
	    			return '下一步'
	    		}
	    	},
	    	...mapGetters(['bottomNavShow'])
	    },
		methods: {
      		next() {
      			//页面展示 下一步
		        if (this.active++ > 2) {
		        	this.active = 0;
		        } else {
		        	this.jump();
		    	}
        	},
        	prev(){
        		alert("上一步");
        		//页面展示 上一步
		        if (this.active-- < 0) {
		        	this.active = 2;
		        } else {
		        	this.jump();
		    	}
        	},
        	jump(){
        		//编程式导航
	        	switch(this.active){
	        		case 1:
	        			this.$router.push('createQuestionnaire');
	        			break;
	        		case 2:
	        			this.$router.push('addSubject');
	        			break;
	        		case 3:
	        			this.$router.push('previewQuestionnaire');
	        			break;
	        	}
		    },
        	...mapActions([
				'setBottomNavShow'
			])
    	}	
	}
</script>
<style>
	.content-block{
		box-sizing: border-box;
		border: 1px solid #ebebeb;
		border-radius: 3px;
		padding: 24px;
		margin: 20px; 
	}
	.content-block:hover {
		box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.6);
	}
	.content-block .form{
		width: 80%;
	}
	.bottomNav {
		text-align: center;
		position: absolute;
		bottom: 24px;
		left: 0;
		right: 0;
	}
</style>