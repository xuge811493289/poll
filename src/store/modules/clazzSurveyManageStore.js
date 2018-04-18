import axios from '../axios'
// 课调管理仓库
export default {
	//初始状态
	state:{
		classesliuyr:[],
		coursesLiuyr:[],
		// 所有的课调
		surveys:[]
	},
	//获取器
	getters:{
		classesliuyr:state=>state.classesliuyr,
		coursesLiuyr:state=>state.coursesLiuyr,
		surveys:state=>state.surveys
	},
	//突变
	mutations:{
		alterClassesLiuyrData(state,data){
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			state.classesliuyr = data.sort(compare('id'));
		},
		alterCoursesLiuyrData(state,data){
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			state.coursesLiuyr = data.sort(compare('id'));
		},
		alterSurveysData(state,data){
			if(data&&data.length>0){
				data.forEach(function(item){
					if(item.status==="create"){
						item.status = "可开启";
					}
					if(item.status==="doing"){
						item.status = "正在课调";
					}
					if(item.status==="done"){
						item.status = "待审核";
					}
					if(item.status==="pass"){
						item.status = "审核已通过";
					}
				});
				function compare(property){
				    return function(a,b){
				        var value1 = a[property];
				        var value2 = b[property];
				        return value1 - value2;
				    }
				}
				state.surveys = data.sort(compare('id'));
			}else{
				state.surveys = data;
			}
			
		}
	},
	//动作
	actions:{
		//查看课调进度
		showSchedule(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/showSchedule.action", {id: ids}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//开启课调
		openSurvey(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/openSurvey.action", {id: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 结束课调
		endSurvey(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/endSurvey.action", {id: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		finsAllClassesLiuyr(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryClass.action').then(({data})=>{
					for(var i=0;i<data.length;i++){
						var chargeArr=data[i].charge.split("%");
						var departmentArr=data[i].department.split("%");
						data[i].charge={
							id:chargeArr[1],
							name:chargeArr[0]
						};
						data[i].department={
							id:departmentArr[1],
							name:departmentArr[0]
						}
					}
					context.commit('alterClassesLiuyrData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		finsAllCoursesLiuyr(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryCourses.action').then(({data})=>{
					context.commit('alterCoursesLiuyrData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查找所有的课调信息
		findAllSurveys(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/querySurvey.action').then(({data})=>{
					context.commit('alterSurveysData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		//保存课调信息
		saveSurveys(context,form){
			//将form封装成后台需要的数据格式
			var sur = {};
		    for (var key in form) {
		    	// 查看form表单的数据，封装之后传给后台 teacherid  courseid   clazzid questionnaireid
		    	if(key==='teacherid' | key==='clazzid' | key==='courseid' | key==='questionnaireid'){
	        		sur[key] = form[key];
	        	}else{
	        		sur['survey.' + key] = form[key];
	        	}
		    }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/createSurvey.action',sur).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		batchDeleteSurveys(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDelSurvey.action", {ids: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}





