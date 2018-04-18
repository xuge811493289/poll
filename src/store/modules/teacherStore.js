import axios from '../axios'
// 教师仓库
export default {
	//初始状态
	state:{
		teachers:[],
		directions:[],
		types:[]
	},
	//获取器
	getters:{
		directions:state=>state.directions,
		types:state=>state.types,
		teachers:state=>state.teachers
	},
	//突变
	mutations:{
		alterTeachersData(state,data){
			data.forEach(function(item){
				if(item.type===0){
					item.type = 'admin';
				}else if(item.type===1){
					item.type = 'teacher';
				}else{
					item.type = 'null';
				}
			});
			//升序排序
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			// 在这里对数据进行排序
			state.teachers = data.sort(compare('id'));
		},
		alterTypesData(state,data){
			state.types = data;
		},
		alterDirectionsData(state,data){
			function compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			    }
			}
			state.directions = data.sort(compare('id'));
		}
	},
	//动作
	actions:{
		batchDeleteTeachers(context,ids){
			return new Promise((resolve,reject)=>{
				axios.post("/manager/batchDelTeacher.action", {ids: ids}).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findAllTeachers(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryAllTeachers.action').then(({data})=>{
					context.commit('alterTeachersData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		saveTeachers(context,form){
			//将form封装成后台需要的数据格式
			var tea = {};
		    for (var key in form) {
	        	if(key==='department'){
	        		tea['teacher.' + key+'.id'] = form[key];
	        	}else{
	        		tea['teacher.' + key] = form[key];
	        	}
		    }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdTeacher.action',tea).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		updateTeachers(context,form){
			//将form封装成后台需要的数据格式
			var tea = {};
		    for (var key in form) {
	        	if(key==='department'){
	        		tea['teacher.' + key+'.id'] = form[key];
	        	}else{
	        		tea['teacher.' + key] = form[key];
	        	}
		    }
			return new Promise((resolve,reject)=>{
				axios.post('/manager/saveOrUpdTeacher.action',tea).then(()=>{
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findAllTeacherTypes(context){
			//在teacher表中的type字段 0代表admin，1代表teacher
			var data = [{
				'val':0,
				'name':'admin'
			},{
				'val':1,
				'name':'teacher'
			}];
			context.commit('alterTypesData',data);
		},
		findAllDirections(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryDirection.action').then(({data})=>{
					//封装成方向模块需要的信息，主要是对方向对象添加了一个所属部门的名称
					var directionsArr = [];
					data.forEach((item)=>{
						//item是一个一个的数组
						var dire = new Object();
						item.forEach((item,index)=>{
							if(index==0){
								dire.name = item.name;
								dire.id = item.id;
								dire.description = item.description;
								dire.belongId = item.belongId;
							}
							if(index==1){
								dire.belongName = item.name;
							}
						});
						directionsArr.push(dire);
					});
					context.commit('alterDirectionsData',directionsArr);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}
	}
}
