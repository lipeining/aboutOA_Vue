import {get, post, put, del} from './helper';

export {
  kickUser
};
const kickUser = get.bind(null, '/api/v1/kickuser');