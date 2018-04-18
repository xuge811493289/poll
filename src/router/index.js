import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Department from '@/pages/settings/department'
import Classes from '@/pages/settings/classes'
import Teacher from '@/pages/settings/teacher'
import Courses from '@/pages/settings/courses'

import Questionnaire from '@/pages/settings/questionnaire/index.vue';
import CreateQuestionnaire from '@/pages/settings/questionnaire/createQuestionnaire';
import AddSubject from '@/pages/settings/questionnaire/addSubject';
import PreviewQuestionnaire from '@/pages/settings/questionnaire/previewQuestionnaire';

import QuestionnaireTemps from '@/pages/settings/questionnaireTemps';

import ClazzSurveyManage from '@/pages/questionnaire/clazzSurveyManage'
import ClazzSurveyCheck from '@/pages/questionnaire/clazzSurveyCheck'
import ClazzSurveyCheckOne from '@/pages/questionnaire/clazzSurveyCheckOne'

import MyLesson from '@/pages/reports/myLesson'
import LessonReport from '@/pages/reports/lessonReport'
import ClazzSurveyReportStore from '@/pages/questionnaire/clazzSurveyReport'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      //方向设置
      path: '/settings/department',
      name: 'Department',
      component: Department
    },{
      //问卷设置
      path: '/settings/questionnaire',
      name: 'Questionnaire',
      component: Questionnaire,
      children:[{
        //创建问卷
        path: 'createQuestionnaire',
        name: 'CreateQuestionnaire',
        component: CreateQuestionnaire
      },{
        //添加题目
        path: 'addSubject',
        name: 'AddSubject',
        component: AddSubject
      },{
        //预览问卷
        path: 'previewQuestionnaire',
        name: 'PreviewQuestionnaire',
        component: PreviewQuestionnaire
      }]
    },{
      //班级设置
      path: '/settings/classes',
      name: 'Classes',
      component: Classes
    },{
      //讲师设置
      path: '/settings/teacher',
      name: 'Teacher',
      component: Teacher
    },{
      //课程设置
      path: '/settings/courses',
      name: 'Courses',
      component: Courses
    },{
      //问卷模板
      path: '/settings/questionnaireTemps',
      name: 'QuestionnaireTemps',
      component: QuestionnaireTemps
    },{
      //课调管理
      path: '/questionnaire/clazzSurveyManage',
      name: 'ClazzSurveyManage',
      component: ClazzSurveyManage
    },{
       //课调审核
      path: '/questionnaire/clazzSurveyCheck',
      name: 'ClazzSurveyCheck',
      component: ClazzSurveyCheck
    },{
       //课调审核
      path: '/questionnaire/clazzSurveyCheckOne',
      name: 'ClazzSurveyCheckOne',
      component: ClazzSurveyCheckOne
    },{
      //课调统计
      path: '/questionaire/clazzSurveyReport',
      name: 'ClazzSurveyReportStore',
      component: ClazzSurveyReportStore
    },{
      //我的课调
      path: '/reports/myLesson',
      name: 'MyLesson',
      component: MyLesson
    },{
      //课调报表
      path: '/reports/lessonReport',
      name: 'LessonReport',
      component: LessonReport
    }
  ]
})
