// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import store from './vuex/user'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import VueQriously from 'vue-qriously'
Vue.use(VueQriously);
import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader);

import ElCollapseItemAbout from './components/collapse-item-about.vue';
// for categories.vue because the origin ELCollapseItem is emitted by
// keyUp enter or down!
Vue.component(ElCollapseItemAbout.name, ElCollapseItemAbout);

import VueSocketio from 'vue-socket.io';
import socketIO from 'socket.io-client';

// we'd better use WEB socket with vue !
Vue.use(VueSocketio, socketIO('http://localhost:3000'));
// Vue.use(VueSocketio, socketIO('http://localhost:3000/admin'));


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el        : '#app',
  router,
  store,
  components: {
    App
  },
  template  : '<App/>'
});
