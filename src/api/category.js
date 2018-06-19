import {get, post, put, del} from './helper';

export {
  createCate, updateCate, updateCategories,
  getCategoryNames, delCate, getCategories, getCategory
};
const createCate       = post.bind(null, '/api/v1/category');
const updateCate       = put.bind(null, '/api/v1/category');
const updateCategories = put.bind(null, '/api/v1/categories');
const delCate          = del.bind(null, '/api/v1/category');
const getCategory      = get.bind(null, '/api/v1/category');
const getCategories    = get.bind(null, '/api/v1/categories');
const getCategoryNames = get.bind(null, '/api/v1/categorynames');

