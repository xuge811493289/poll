// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import JpUI from './components';
import store from './store';

import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

/*
	注册组件
*/
//饿了么组件
Vue.use(ElementUI);
//杰普组件
Vue.use(JpUI);

/* 
	自定义样式
*/
import './css/index.css';

/*
	实例化Vue根对象
*/
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

