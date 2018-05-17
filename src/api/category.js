import {get, post, put, del} from './helper';

export {createCate, updateCate, delCate, getCategories, getCategory};
const createCate    = post.bind(null, '/api/v1/category');
const updateCate    = put.bind(null, '/api/v1/category');
const delCate       = del.bind(null, '/api/v1/category');
const getCategory   = get.bind(null, '/api/v1/category');
const getCategories = get.bind(null, '/api/v1/categories');

