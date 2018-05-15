// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'
import store from './vuex/user'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false;

const router = new VueRouter({
  mode  : 'history',
  routes: routes
});

// 登录中间验证，页面需要登录,而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLogin) {
      next();
    } else {
      next({
        path : '/login',
        query: {redirect: to.fullPath}
      });
    }
  } else if (to.matched.some(record => record.meta.requiresNotAuth)) {
    if (store.getters.isLogin) {
      next({
        path: '/home'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el        : '#app',
  router,
  store,
  components: {App},
  template  : '<App/>'
});
