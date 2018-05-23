import {get} from './helper';

export {getLogs};

const getLogs = get.bind(null, '/api/v1/logs');
