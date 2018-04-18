import axios from '../axios'


export default {
	//初始状态
	state:{
		coursess:[]
	},
	//获取器
	getters:{
		coursess:state=>state.coursess
	},
	//突变
	mutations:{
		alterData(state,data){
			state.coursess = data;
		}
	},
	//动作
	actions:{
		batchDeleteCourses_c(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDelCourses.action", { ids: ids }).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
			 
		},
		searchByCourseName_c(context,searchObj){

			return new Promise((resolve,reject)=>{
				axios.post("/manager/findCourseByName.action", searchObj).then(({data})=>{
					context.commit('alterData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findAllCourses_c(context){

			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryCourses.action').then(({data})=>{
					context.commit('alterData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		
		saveCourses_c(context,form){
			//将form封装成后台需要的数据格式
			var cou = {};
      for (var key in form) {
          cou['course.' + key] = form[key]
      }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdCourse.action',cou).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}