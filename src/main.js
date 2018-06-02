// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import store from './vuex/user'
import ElementUI from 'element-ui'
import BootstrapVue from 'bootstrap-vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import ElCollapseItemAbout from './components/collapse-item-about.vue';
// for categories.vue because the origin ELCollapseItem is emitted by
// keyUp enter or down!
Vue.component(ElCollapseItemAbout.name, ElCollapseItemAbout);

import VueSocketio from 'vue-socket.io';
import socketIO from 'socket.io-client';
// Vue.use(VueSocketio, socketIO('http://localhost:3000'));
Vue.use(VueSocketio, socketIO('http://localhost:3000/admin'));

Vue.use(BootstrapVue);
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el        : '#app',
  router,
  store,
  components: {App},
  template  : '<App/>'
});
