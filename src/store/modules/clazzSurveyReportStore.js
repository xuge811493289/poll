import axios from '../axios'


export default {
	//初始状态
	state:{
		clazzs_dir:[],
		teachersLessonReport:[],
		allClazzLessonReport:[],
		allTeas:[]
	},
	//获取器
	getters:{
		clazzs_dir:state=>state.clazzs_dir,
		teachersLessonReport:state=>state.teachersLessonReport,
		allClazzLessonReport:state=>state.allClazzLessonReport,
		allTeas:state=>state.allTeas
	},
	//突变
	mutations:{
		alterData(state,data){
			state.clazzs_dir = data;
		},
		alterAllTeacherData(state,data){
			state.teachersLessonReport = data;
		},
		alterAllClazzData(state,data){
			state.allClazzLessonReport = data;

		},
		alterTeasData(state,data){
			state.allTeas=data
		}

	},
	//动作
	actions:{
		findAllTeachers_re(context){
			return new Promise((resolve,reject)=>{
				axios.get('/manager/queryAllTeachersAndAllDepartment.action').then(({data})=>{
					context.commit('alterTeasData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findAllClazzByDirId(context,paramData){
			//根据方向id查找当前方向下的所有班级
			/*
				参数：{departid:1}
				返回值：[{id:1,name:'web1701'},{id:2,name:'web1702'}]

			*/
			return new Promise((resolve,reject)=>{
				axios.post('/manager/queryAllClassByDepartId.action',paramData).then(({data})=>{
					//data=[{id:1,name:'web1701'},{id:2,name:'web1702'}];
					context.commit('alterData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},//fandAll结束位置
		findAllTeachersLessonReport(context,paramData){
			//根据当前班级id，获取当前班级所有教师的课调信息
			/*
				参数：{clazzid:21}
				返回值：{id:21,name:'web1701',allTeacherlessonReports:[{id:1,name:'张三',lessonReport:[]},{id:2,name:'李四',lessonReport:[]}

			*/
			return new Promise((resolve,reject)=>{
				axios.post('/manager/queryTeacherAllSurveyByClazzId.action',paramData).then(({data})=>{
					context.commit('alterAllTeacherData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		},//fandAll结束位置
		findAllClazzLessonReport(context,paramData){
			//根据教师id查找当前教师的所有课调信息
			/*
				参数：{teacherid:1001}
				返回值：{id:1001,name:'张三',allClazzlessonReports:[{id:1,name:'web1701',lessonReport:{}},{id:2,name:'web1702',lessonReport:{}}]}

			*/

			return new Promise((resolve,reject)=>{

				axios.post('/manager/queryClassAllSurveyByTeacherId.action',paramData).then(({data})=>{

					context.commit('alterAllClazzData',data);
					resolve();
				}).catch((error)=>{
					reject(error);
				});
			});
		}//fandAll结束位置
		
	}
}