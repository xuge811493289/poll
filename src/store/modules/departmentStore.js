import axios from '../axios'

// 方向仓库
export default {
	//初始状态
	state:{
		departments:[]
	},
	//获取器
	getters:{
		departments:state=>state.departments
	},
	//突变
	mutations:{
		alterDepartmentData(state,data){
			//升序排序
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			state.departments = data.sort(compare('id'));
		}
	},
	//动作
	actions:{
		batchDeleteDepartment(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDelDepartment.action", {ids: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			}); 
		},
		//查找所有的一级部门，不包括方向
		findAllDepartments(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryAllDepartment.action').then(({data})=>{
					context.commit('alterDepartmentData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		saveDepartment(context,form){
			//将form封装成后台需要的数据格式
			var dep = {};
		    for (var key in form) {
		    	if(key==='department'){
					dep['department.belongId'] = form[key];
		    	}else{
		    		dep['department.' + key] = form[key];
		    	} 
		    }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdDepartment.action',dep).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}