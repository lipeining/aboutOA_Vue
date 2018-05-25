import {get, post, put, del} from './helper';

export {login, reg, update, logout, getCaptcha, delCaptcha, delUser, getUsers, getUser, grantUser};
const login      = post.bind(null, '/api/v1/login');
const reg        = post.bind(null, '/api/v1/reg');
const logout     = get.bind(null, '/api/v1/logout');
const getCaptcha = get.bind(null, '/api/v1/captcha');
const delCaptcha = del.bind(null, '/api/v1/captcha');
const update     = put.bind(null, '/api/v1/user');
const delUser    = del.bind(null, '/api/v1/user');
const getUsers   = get.bind(null, '/api/v1/users');
const getUser    = get.bind(null, '/api/v1/user');
const grantUser  = post.bind(null, '/api/v1/grant');
