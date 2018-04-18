import Vuex from 'vuex'
import Vue from 'vue'

import departmentStore from './modules/departmentStore'
import classesStore from './modules/classesStore'
import teacherStore from './modules/teacherStore'
import courseStore from './modules/courseStore'
import questionnaireStore from './modules/questionnaireStore'
import clazzSurveyManageStore from './modules/clazzSurveyManageStore'
import clazzSurveyCheckStore from './modules/clazzSurveyCheckStore'
import myLessonStore from './modules/myLessonStore'
import lessonReportStore from './modules/lessonReportStore'
import clazzSurveyReportStore from './modules/clazzSurveyReportStore'

Vue.use(Vuex);

export default new Vuex.Store({
	modules:{
		departmentStore,
		classesStore,
		teacherStore,
		courseStore,
		questionnaireStore,
		clazzSurveyManageStore,
		clazzSurveyCheckStore,
		myLessonStore,
		lessonReportStore,
		clazzSurveyReportStore
	}
});