import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from '@/components/home'
import login from '@/components/login'
import reg from '@/components/reg'
import backend from '@/components/backend'
import users from '@/components/users'
import profile from '@/components/profile'
import projects from '@/components/projects'
import categories from '@/components/categories'

Vue.use(Router);

let routes = [
  {
    path     : '/',
    name     : 'HelloWorld',
    component: HelloWorld,
    meta     : {requiresNotAuth: true}
  },
  {
    path     : '/reg',
    name     : 'reg',
    component: reg,
    meta     : {requiresNotAuth: true}
  },
  {
    path     : '/login',
    name     : 'login',
    component: login,
    meta     : {requiresNotAuth: true}
  },
  {
    path     : '/home',
    name     : 'home',
    component: home,
    meta     : {requiresAuth: true}
  },
  {
    path     : '/backend',
    name     : 'backend',
    component: backend,
    meta     : {requiresAuth: true},
    children : [
      {
        path     : '/profile',
        name     : 'profile',
        component: profile,
        meta     : {requiresAuth: true}
      },
      {
        path     : '',
        name     : 'main',
        component: projects,
        meta     : {requiresAuth: true}
      },
      {
        path     : '/users',
        name     : 'users',
        component: users,
        meta     : {requiresAuth: true}
      },
      {
        path     : '/projects',
        name     : 'projects',
        component: projects,
        meta     : {requiresAuth: true}
      },
      {
        path     : '/categories',
        name     : 'categories',
        component: categories,
        meta     : {requiresAuth: true}
      }
    ]
  },
];
export default routes;
