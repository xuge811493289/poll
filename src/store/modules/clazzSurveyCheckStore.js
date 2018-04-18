import axios from '../axios'
// 课调审核仓库
export default {
	//初始状态
	state:{
		//课调信息，包括id，教师，问卷模板之类的
		surveyInfo:null,
		//所有的答卷信息
		choices:[]
	},
	//获取器
	getters:{
		choices:state=>state.choices,
		surveyInfo:state=>state.surveyInfo,
	},
	//突变
	mutations:{
		alterChoicesData(state,data){
			//升序排序
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			// 在这里对数据进行排序
			if(data){
				data.forEach(function(item){
					item.simpleAnswers.sort(compare('subjectId'));
				});
				state.choices = data.sort(compare('id'));
			}else{
				state.choices = data;
			}
		},
		alterSurveyInfoData(state,data){
			state.surveyInfo = data;
		},
	},
	//动作
	actions:{
		//审核通过课调
		checkSurvey(context,id){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/checkSurvey.action", {id: id}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		SaveSurveyInfo(context,row){
			context.commit('alterSurveyInfoData',row);
		},
		//通过课调id获取答卷信息
		findChoiceBySurveyId(context,id){
			//这里是课调的信息，包括id，教师，问卷模板之类的
			return new Promise((resolve,reject)=>{
				axios.post("/manager/findChoiceBySurveyId.action", {id: id}).then(({data})=>{
					context.commit('alterChoicesData',data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//更改简答题
		changeChoices(context,form){
			// console.log("store里的打印，",form);
			//封装成后台需要的数据
			//.....
			return new Promise((resolve,reject)=>{
				axios.post('/manager/changeChoices.action',{changeChoices:JSON.stringify(form)}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 删除答卷
		batchDeleteAnswerSheets(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDeleteAnswerSheets.action", {ids: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
	}
}





