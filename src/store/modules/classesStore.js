import axios from '../axios'


export default {
	//初始状态
	state:{
		classes:[],
		charges:[],
		department:[]
	},
	//获取器
	getters:{
		classes:state=>state.classes,
		charges:state=>state.charges,
		department:state=>state.department
	},
	//突变
	mutations:{
		alterData(state,data){
			state.classes = data;
		},
		alterData2(state,data){
			state.charges=data
		},
		alterDepartmentData(state,data){
			state.department=data;
		}
	},
	//动作
	actions:{
		batchDeleteClasses(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDelClass.action", { ids: ids }).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
			 
		},
		findAllDepartment(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryDepartment.action').then(({data})=>{
					context.commit('alterDepartmentData',data);

					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findAllCharges(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryAllMasterIdAndName.action').then(({data})=>{
					context.commit('alterData2',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		searchByKey(context,searchObj){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/findClazzByName.action", searchObj).then(({data})=>{
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
					context.commit('alterData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findAllClasses(context){
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

					context.commit('alterData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		saveClasses(context,form){
			//将form封装成后台需要的数据格式
			var cla = {};
      for (var key in form) {
          cla['clazz.' + key] = form[key]
      }
    
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdClass.action',cla).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}