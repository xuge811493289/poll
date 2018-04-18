import axios from '../axios'


export default {
	//初始状态
	state:{
		myLessons:[]
	},
	//获取器
	getters:{
		myLessons:state=>state.myLessons
	},
	//突变
	mutations:{
		alterData(state,data){
			state.myLessons = data;
		}
	},
	//动作
	actions:{
		findAllMyLessons(context){
			let teacrherId={
				teacherid:33
			};
			return new Promise((resolve,reject)=>{
				axios.post("/manager/querySurveySimpleByTeacherId.action", teacrherId).then(({data})=>{
					
				var dataDone=data.filter(function(item){
					return item.survy.status=='pass';//当前问卷状态为审核通过时显示
				});


				var newData=[];
				for(let i=0;i<dataDone.length;i++){
					
					//获取当前教师的所有基本数据(除了主观题答案)
					var dataSurvy=data[i].survy;
					//判断类型
					if(dataSurvy.questionnaire){
						var questType=dataSurvy.questionnaire.name.match('主讲') || dataSurvy.questionnaire.name.match('辅导');
					}else{
						var questType="主讲/辅导";//questType不存在时，不知当前问卷类型为主讲还是辅导
					}
					
					
					var obj={
							teacherName:dataSurvy.teacher.realname,
							questionId:dataDone[i].commits[0].questionnaire.id,//dataSurvy.questionnaire.id,
							questionName:dataSurvy.questionnaire.name,
							lessonName:dataSurvy.course.name,
							type:questType,
							clazzName:dataSurvy.clazz.name,
							date:dataSurvy.date,
							totalNumber:dataSurvy.count,
							validNumber:dataSurvy.valid,
							average:dataSurvy.average,/*平均分*/
							remarks:data[i].commits
						};
						newData.push(obj);
				}

					
					context.commit('alterData',newData);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});

		}
	}
}



