<template>
  <div id="app">
    <div class="jp-app-container">
      <div class="jp-home-header">
        <div class="logo">
          <i class="fa fa-graduation-cap" style="font-size:42px"></i>智慧校园课调云平台
        </div>
        <div class="right">
          <ul class="userInfo">
            <li><i class="userInfoIcon fa fa-user-circle-o"></i></li>
            <li>管理员</li>
          </ul>
          <div class="logout">
            退出
          </div>
        </div>
      </div>
      <div class="jp-home-body">
          <!-- 头部左侧 -->
          <div class="head-left">
            <ul class="shortcuts">
              <li><i class="fa fa-align-justify fa-fw"></i></li>
              <li><i class="fa fa-cog fa-fw"></i></li>
              <li><i class="fa fa-balance-scale fa-fw"></i></li>
              <li><i class="fa fa-user-circle fa-fw"></i></li>
            </ul>
          </div>
          <!-- 头部右侧 -->
          <div class="head-right">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>{{firstTitle}}</el-breadcrumb-item>
              <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 体部左侧开始 -->
          <div class="body-left">
            <el-menu unique-opened default-active="/settings/department" router background-color="#f2f2f2" text-color="#737373">
              <el-submenu index="2">
                <template slot="title"><i class="fa fa-cog fa-fw"></i>&nbsp;设置</template>
                <el-menu-item @click="getText($event)" index="/settings/department"><i class="fa fa-angle-double-right"></i>&nbsp;方向设置</el-menu-item>
                <el-menu-item @click="getText($event)" index="/settings/classes"><i class="fa fa-angle-double-right"></i>&nbsp;班级设置</el-menu-item>
                <el-menu-item @click="getText($event)" index="/settings/teacher"><i class="fa fa-angle-double-right"></i>&nbsp;讲师设置</el-menu-item>
                <el-menu-item @click="getText($event)" index="/settings/courses"><i class="fa fa-angle-double-right"></i>&nbsp;课程设置</el-menu-item>
                <el-menu-item @click="getText($event)" index="/settings/questionnaire/createQuestionnaire"><i class="fa fa-angle-double-right"></i>&nbsp;问卷设置</el-menu-item>
                <el-menu-item @click="getText($event)" index="/settings/questionnaireTemps"><i class="fa fa-angle-double-right"></i>&nbsp;问卷模板</el-menu-item>
                <el-menu-item @click="getText($event)" index="/settings/remarksCourseContent"><i class="fa fa-angle-double-right"></i>&nbsp;系统设置</el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title"><i class="fa fa-balance-scale fa-fw"></i>&nbsp;课调管理</template>
                <el-menu-item @click="getText($event)" index="/questionnaire/clazzSurveyManage"><i class="fa fa-angle-double-right"></i>&nbsp;课调管理</el-menu-item>
                <el-menu-item  @click="getText($event)" index="/questionnaire/clazzSurveyCheck"><i class="fa fa-angle-double-right"></i>&nbsp;课调审核</el-menu-item>
                <el-menu-item @click="getText($event)" index="/questionaire/clazzSurveyReport"><i class="fa fa-angle-double-right"></i>&nbsp;课调统计</el-menu-item>
                <!-- <el-menu-item index="/clazzBegin/clazzHeartRateCurves"><i class="fa fa-angle-double-right"></i>&nbsp;课调开启</el-menu-item>
                <el-menu-item index="/clazzBegin/clazzHeartRateList"><i class="fa fa-angle-double-right"></i>&nbsp;课调监控</el-menu-item>
                 -->
              </el-submenu>
              <el-submenu index="4">
                <template slot="title"><i class="fa fa-user-circle fa-fw"></i>个人信息</template>
                <el-menu-item @click="getText($event)" index="/reports/myLesson"><i class="fa fa-angle-double-right"></i>&nbsp;我的课调</el-menu-item>
                <el-menu-item @click="getText($event)" index="/reports/lessonReport"><i class="fa fa-angle-double-right"></i>&nbsp;课调报表</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <div class="body-right">
            <!-- 路由 -->

            <router-view></router-view>
          </div>
      </div>
      <!-- <div class="jp-home-footer">bottom</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  created(){
    this.$router.push('/settings/department');
  },
  data(){
    return {
      firstTitle:'设置',
      title:'方向设置'
    }
  },
  methods:{  
     //点击二级菜单之后，指示那里显示对应的一级菜单和二级菜单的提示 
    getText(event){
      this.title = event.$el.childNodes[1].data.trim();
      if(this.title==="课调管理" | this.title==="课调审核" | this.title==="课调统计"){
        this.firstTitle = "课调管理";
      }else if(this.title=="我的课调" | this.title=="课调报表"){
        this.firstTitle = "个人信息";
      }else{
        this.firstTitle = "设置";
      }
    }
  }
}
</script>

<style>
/*表单中操作的元素设置内边距*/
table i.fa{
  padding: 0 3px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app .jp-home-header {
  background-color: #448db8;
}
.jp-home-header:after {
  content: "";
  display: block;
  clear: both;
}
.jp-home-header .logo {
  float: left;
  height: 60px;
  line-height: 60px;
  margin: 0 40px;
  font-size: 22px;
  color: #FFFFFF;
}
.jp-home-header .right{
  float: right;
}
.jp-home-header .right>*{
  float: left;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #FFF;
}
.jp-home-header .right:after{
  content: '';
  display: block;
  clear: both;
}
.jp-home-header .userInfo{
  width: 10em;
  background-color: #67B23a;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.jp-home-header .userInfo > li {
  float: left;
  line-height: unset;
}
.jp-home-header .userInfo i.userInfoIcon{
  line-height: 60px;
  font-size: 40px;

}
.jp-home-header .userInfo>li:first-child{
  width: 4em;
  text-align: center;
}

.jp-home-header .right>div.logout{
  width: 5em;
  cursor: pointer;
}
.jp-home-body > .head-left > .shortcuts{
  margin:0 auto;
}
.jp-home-body > .head-left > .shortcuts:after {
  content: '';
  display: block;
  clear: both;
}
.jp-home-body > .head-left > .shortcuts > li{
  line-height: 44px;
  float: left;
  width: 44px;
  border-radius: 2px;
  margin: 2px;
  text-align: center;
  color: #FFF;
  cursor: pointer;
}
.jp-home-body > .head-left > .shortcuts > li:nth-child(1){
  /*background-color: #a1d2f9;*/
  background-color: #448db8;
}

.jp-home-body > .head-left > .shortcuts > li:nth-child(2){
  background-color: #67c23a;
}
.jp-home-body > .head-left > .shortcuts > li:nth-child(3){
  background-color: #ffb35f;
}
.jp-home-body > .head-left > .shortcuts > li:nth-child(4){
  /*background-color: #dc636a;*/
   background-color: #f78989;
}

.jp-home-body > .body-left {
  background-color: #f2f2f2;
  overflow-y:auto;
  text-align: left;
}
.jp-home-body > .body-right {
  padding: 10px;
  overflow:auto;
}
.jp-home-footer{
  background-color: #414141;
}
.jp-home-footer {
  color: #FFFFFF;
  text-align: center;
  height: 40px;
  line-height: 40px;
}

/*element*/
#app .el-breadcrumb {
  line-height: 48px;
  padding: 0 20px;
}
/*去掉el-menu多余的1px border-right*/
#app .el-menu{
  border-right:none;
}
/*去掉田字中间的1px*/
.body-left{
  margin-top:-1px;
}


</style>
