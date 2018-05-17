import {get, post, put, del} from './helper';

export {createPro, updatePro, delPro, getProjects, getProject};

const createPro   = post.bind(null, '/api/v1/project');
const updatePro   = put.bind(null, '/api/v1/project');
const delPro      = del.bind(null, '/api/v1/project');
const getProject  = get.bind(null, '/api/v1/project');
const getProjects = get.bind(null, '/api/v1/projects');

