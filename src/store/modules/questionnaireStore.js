import axios from '../axios'

// 问卷模板仓库
export default {
	//初始状态
	state:{
		//问卷ID  由创建问卷页面产生，给添加题目和预览使用
		queId:null,
		//所有的题目类型
		subTypes:null,
		//控制上一步，下一步的显示与隐藏
		bottomNavShow:null,
		//某个问卷信息
		queInfo:null,
		//某个问卷对应的所有的题目
		queSubjects:null,
		//所有问卷信息
		questionnaires:null,
	},
	//获取器
	getters:{
		questionnaires:state=>state.questionnaires,
		queId:state=>state.queId,
		subTypes:state=>state.subTypes,
		bottomNavShow:state=>state.bottomNavShow,
		//某个问卷信息
		queInfo:state=>state.queInfo,
		//某个问卷对应的所有单选题目   【【可以在这里添加之后项目中需要的学生选择的选项，可在每一个题目中添加一个属性answer】】
		radioSubjects(state){
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			// 在这里对数据进行排序
			if(state.queSubjects){
				let tempRadioSubjects = state.queSubjects.filter((item)=>{
					return item.subjectType === "单选";
				});
				console.log(tempRadioSubjects);
				return tempRadioSubjects.sort(compare('id'));
			}
			return null;
		},
		//某个问卷对应的所有多选题目
		checkboxSubjects(state){
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			if(state.queSubjects){
				return state.queSubjects.filter((item)=>{
					return item.subjectType === "多选";
				}).sort(compare('id'));
			}
			return null;
		},
		//某个问卷对应的所有简答题目
		simpleSubjects(state){
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			if(state.queSubjects){
				return state.queSubjects.filter((item)=>{
					return item.subjectType === "简答";
				}).sort(compare('id'));
			}
			return null;
		}
	},
	//突变
	mutations:{
		alterBottomNavShowData(state,data){
			state.bottomNavShow = data;
		},
		alterQueIdData(state,data){
			state.queId = data;
		},
		alterSubTypesData(state,data){
			state.subTypes = data;
		},
		alterSubjectsData(state,data){
			//在这里完成问卷信息的赋值和题目信息的赋值
			state.queSubjects = data.subject;
			state.queInfo = data.questionnaire;
		},
		alterQuestionnaireData(state,data){
			state.questionnaires = data;
		}
	},
	//动作
	actions:{
		//查找所有的问卷信息
		findAllQuestionnaire(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryAllQuestionnaire.action').then(({data})=>{
					context.commit('alterQuestionnaireData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//删除问卷信息
		batchDeleteQuestionnaires(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDeleteQuestionarie.action", {ids: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},

		//设置 .setBottomNav 的显示与隐藏（上一步与下一步）
		setBottomNavShow(context,val){
			context.commit('alterBottomNavShowData',val);
		},
		//保存问卷信息
		saveQuestinnaires(context,form){
			//将form封装成后台需要的数据格式
			var que = {};
		    for (var key in form) {
	        	que['questionnaire.' + key] = form[key];
		    }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdQuestionnaire.action',que).then(({data})=>{
					//将后台传递过来的id保留，之后添加题目的时候再携带过去
					context.commit('alterQueIdData',data.id);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//保存题目信息
		saveSubjects(context,form){
			//将form封装成后台需要的数据格式
			var sub = {};
		    for (var key in form) {
		    	if(key==="queId"){
		    		sub['questionnaire.id'] = form[key];
		    	}else if(key==="choices"){
					sub[key] = form[key];
		    	}else{
		    		sub['subject.'+key] = form[key];
		    	}
		    }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdSubjectAndChoice.action',sub).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//查询所有的题目类型
		queryAllSubjectTypes(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/querySubjectType.action').then(({data})=>{
					context.commit('alterSubTypesData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//查找某个问卷对应的所有题目信息
		queryQuestionnaireById(context,id){
			return new Promise((resolve,reject)=>{
				axios.post('/manager/queryQuestionnaireById.action',{queId:id}).then(({data})=>{
					context.commit('alterSubjectsData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}

	}
}
