<template>
	<el-row :gutter="20" class='lessonReStyle'>
	  <el-col :span="18" class='elCols' style='' id='leftDivHeight'>
	  	<div class="grid-content"  ref='main' id='chartDiv' style=''>
	  		<!-- <div   class='chartDiv'></div> -->
	  	</div>
	  	<div id="noDataTime"><i class="fa fa-file-text-o" style="color:#9282A6;width:30px;height:30px" @click="toSee(scope.$index, scope.row)" ></i>暂无数据</div>
	  </el-col>
	  <el-col :span="6" class='elCols' style="height:300px">
	  	<div class="grid-content" style='height:200px'>
	  		<el-form :inline="true" :model="newSigleObj" id='rightDd' class="demo-form-inline" size="medium">
				  <el-form-item label=" 题  目 ">
				    <el-input v-model="newSigleObj.newZhuTitle" placeholder="题目" style="width:110%"></el-input>
				  </el-form-item>
				  <el-form-item label="平均分">
				    <el-input v-model="newSigleObj.newZhuAver" placeholder="平均" style="width:110%;"></el-input>
				  </el-form-item>
			</el-form>
	  </div>
	</el-col>

	</el-row>
	<!-- <div class="outer">
		 <div  ref='main' class='chartDiv'></div>
		 <div style="width:200px;height:200px;background-color:#F2F2F2;display:inline-block;broder:1px solid red;margin-bottom:900px">
		 	<el-form :inline="true" :model="newSigleObj" class="demo-form-inline" size="medium">
				  <el-form-item label=" 题目 ">
				    <el-input v-model="newSigleObj.newZhuTitle" placeholder="题目" style="width:333px"></el-input>
				  </el-form-item>
				  <el-form-item label="平均分">
				    <el-input v-model="newSigleObj.newZhuAver" placeholder="平均分" style="width:333px"></el-input>
				  </el-form-item>
			</el-form>
			<div class="myDiv">
				题目：
				<div v-model='newSigleObj.newZhuTitle'></div>
			</div>
		</div>
	</div> -->
</template>
<script type="text/javascript">
import * as echarts from 'echarts';
import {mapGetters,mapActions,mapMutations} from 'vuex';
/*import myLessonStore from '../../../store/modules/myLessonStore	'*/
	export default {  
	  data () {  
	    return {  
	       
	        form:{
	        	
	        },
	        newSigleObj:{
	        	newZhuTitle:'',
	        	newZhuAver:''
	        }

	    }  
	  },  
    //映射数据
		computed:{
			...mapGetters(['allChoices','myLessons'])
		},
		/*created(){
			var chartDiv=document.getElementById('chartDiv');
			chartDiv.style.height='580px';
		},*/
	  mounted () {  
	  	var vm= this;
	    
	     //根据不同分辨率改变左侧图标外层div的高度
	     var leftDiv=document.getElementById('leftDivHeight');
	     var body=document.body;
	     var chartDiv=document.getElementById('chartDiv');
			
	      /*
			window.innerHeight：
				1920*1080：1068
				1600*900:867
				1280*720：666
				800*600：532

	     */
	     if(window.innerHeight<700){
	     	leftDiv.style.height='510px';
	     	chartDiv.style.height='500px';
	     }else if(window.innerHeight>700 && window.innerHeight<900){
	     	leftDiv.style.height='700px';
	     	chartDiv.style.height='690px';

	     }else if(window.innerHeight>1000){
	     	leftDiv.style.height='870px';
	     	chartDiv.style.height='836px';
	     }

	      this.init(vm.$route.query.questionId,vm.$route.query.questionName);

	     

	   
	     	
	  },  
	  methods:{  
	  	 init(qId,qName){
	  	 	 const self = this;  
	  	 	 var chartForm=null;

	      	 var myChart = echarts.init(this.$refs.main);
	      	 document.getElementById('noDataTime').style.display='none';//隐藏没有数据 div
     		 document.getElementById('rightDd').style.display='none';
     		 document.getElementById('chartDiv').style.display='none';//显示折线图
					     		
	  	 		if(!qId){

	  	 				var qId='';
	  	 				var qName='';
	  	 				this.findAllMyLessons().then(()=>{
	  	 					//console.log(this.myLessons,'myLessons---');
	  	 					 var bigDate=new Date(1000);
					     	 var mylessBig =null;
					     	for(var i=0;i<this.myLessons.length;i++){
					     		var myless = this.myLessons[i];
					     		var newDat=new Date(myless.date).getTime();
					     		if(newDat>bigDate){
					     			bigDate = newDat;
					     			mylessBig = myless;
					     		}
					     	}

					     	if(mylessBig){//当前教师存在课调信息11
					     		document.getElementById('noDataTime').style.display='none';//隐藏没有数据 div
					     		document.getElementById('rightDd').style.display='block';
					     		document.getElementById('chartDiv').style.display='inline-block';//显示折线图
					     		
					     		qId=mylessBig.questionId;
						     	qName=mylessBig.questionName;
							     this.form.questionId=qId;
							     this.form.questionName=qName;

						     	this.findAllChoices(qId).then(()=>{
				     			var titleArr=[];
									var averageArr=[];
									for(let i=0;i<this.allChoices.length;i++){
										
										titleArr.push(this.allChoices[i].name);
										averageArr.push(this.allChoices[i].grade);
									}
									var newObj={
										titleArr:titleArr,
										averageArr:averageArr
									};

									this.form.averageArr=newObj.averageArr;
				     				this.form.titleArr=newObj.titleArr;
									setOptions('当前为  '+this.form.questionName+'  柱状图',this.form.titleArr,this.form.averageArr);
									chartForm=this.form;
							     	
						     	});
					     	}else{//当前教师不存在课调信息if11
					     		//setOptions('没有课调信息',[],[]);
					     		this.$message({type: 'info', message: '当前没有课调信息'});
					     		document.getElementById('chartDiv').style.display='none';//隐藏折线图
					     		document.getElementById('rightDd').style.display='none';//右侧div进行隐藏
					     		document.getElementById('noDataTime').style.display='block';//显示没有数据 div
					     		


					     	}

					     

	  	 				});//findAllMyLesson end---

	  	 		}
	  	 		else{

	  	 			document.getElementById('chartDiv').style.display='inline-block';//显示折线图
		     		document.getElementById('rightDd').style.display='inline-block';
		     		document.getElementById('noDataTime').style.display='none';//隐藏没有数据 div
	     			this.form.questionId=qId;
			    	this.form.questionName=qName;
					this.findAllChoices(qId).then(()=>{
		     			var titleArr=[];
						var averageArr=[];

						for(let i=0;i<this.allChoices.length;i++){
							titleArr.push(this.allChoices[i].name);
							averageArr.push(this.allChoices[i].grade);
						}

						var newObj={
							titleArr:titleArr,
							averageArr:averageArr
						};

						this.form.averageArr=newObj.averageArr;
		     			this.form.titleArr=newObj.titleArr;
			     				

						setOptions('当前为  '+this.form.questionName+'  柱状图',this.form.titleArr,this.form.averageArr);
						chartForm=this.form;
			     	
		     	});
	  	 		}

	  	 		//-------------------设置柱状图
	  	 		function setOptions(a,b,c){
	  	 			var newB=[];
	  	 			for(var i=0;i<b.length;i++){
	  	 				var newTitle='题目'+(i+1);
	  	 				newB.push(newTitle);
	  	 			}




			    var option = {
		        	title: {
		                text:a,
		        		textStyle:{//标题内容的样式
		                    color:'#909399',
		                    fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
		                    fontSize:24//主题文字字体大小，默认为18px

		                },
		                  left:"center"
		            },
		          textStyle: {
			        	fontWeight: 'normal',             
			        	color: '#909399' //xy坐标字体颜色
			      	},

		          color: ['#FFB35F'],/*柱体颜色*/
					    tooltip : {
					        trigger: 'axis',
					        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					        }
					    },
					    grid: {
					        left: '3%',
					        right: '4%',
					        bottom: '3%',
					        containLabel: true
					    },
					    xAxis : [
					        {
					            type : 'category',
					           data:newB,//x 轴显示
					           axisTick: {
					               alignWithLabel: true
					            }
					        }
					    ],
					    yAxis : [
					        {
					            type : 'value'
					        }
					    ],
					    series : [
					        {
					            name:'平均分',
					            type:'bar',
					            barWidth: '60%',
					           data:c //y 轴显示
					        }
					    ]
		        };

		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
		        myChart.on('mouseover',function(event){
		        	var titleIndex=Number(event.name.slice(2,3));
		        	var newZhuTitle='';
		        	var newZhuAver;
		        	chartForm.titleArr.forEach(function(item,index,arr){
		        		//console.log(index+1);
		        		newZhuTitle=arr[titleIndex-1];
		        	});
		        	chartForm.averageArr.forEach(function(item,index,arr){
		        		newZhuAver=arr[titleIndex-1];
		        	});
		        	
		        	self.newSigleObj.newZhuTitle=newZhuTitle;
		        	self.newSigleObj.newZhuAver=newZhuAver;



		        	 
		        });
		       
			    }
		  	 		
	  	 },
	    
	    
	    
	    //映射Store中的方法
		    ...mapActions([
				'findAllChoices',
				'findAllMyLessons'
				
			]),
	  }  
	  
	}  

	
    
</script>
<style>
	/* .outer{
		width: 100%;
		margin-top:70px;
		border:2px solid red;
		overflow:hidden;
	} */
	.demo-form-inline{
		/* width:333px;
		height: 200px; */
		/* float:right; */
		background-color:#F2F2F2;
		margin-top:30px;
		/* margin-right: 100px; */
		padding:10px;

	}
	/* .myDiv{
		width:20%;
		height: 200px;
		float:right;
		background-color:#F2F2F2;
		margin-top:30px;
		margin-right: 100px;
		padding:10px;
	} */
	/* .chartDiv{
		
		width: 1200px;
		height:600px;
		display:inline-block
	} */

	.lessonReStyle .el-row {
    	margin-bottom: 20px;
	    &:last-child {
	      margin-bottom: 0;
	    }
	  }
	 .lessonReStyle .el-col {
	    border-radius: 4px;
	  }
	 
	 .lessonReStyle .grid-content {
	 	
	    border-radius: 4px;
	   /*  min-height: 836px; */
	    width: 100%;
	   
	    
	  }
	 
	#rightDd{
		display:none;
	}
	.elCols{
		overflow:auto;
		
		/* height:470px; */
	}

	#noDataTime{
		
		text-align: center;
		min-height: 50px;
		line-height: 50px;
		color: #9282A6;
		margin-left:50px;
		display:block;

	}

	/* .lessonReStyle .leftDiv{
	
	} */


</style>

