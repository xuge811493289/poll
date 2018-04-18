import axios from '../axios'


export default {
	//初始状态
	state:{
		allChoices:[],
	},
	//获取器
	getters:{
		allChoices:state=>state.allChoices,
	},
	//突变
	mutations:{
		alterData(state,data){
			state.allChoices = data;
		}
	},
	//动作
	actions:{
		
		
		findAllChoices(context,questionId){
			var obj={
				survyid:questionId
			};
			return new Promise((resolve,reject)=>{
				axios.post('/manager/querySurveyRedioAvgBySurvyId.action',obj).then(({data})=>{
					context.commit('alterData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}