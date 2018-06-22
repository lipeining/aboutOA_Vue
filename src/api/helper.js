const request = require('superagent');
import store from '../vuex/user';
import router from '../router';

export {get, post, put, del};

function handleResponse(res) {
  // console.log(res);
  if (res.body.code === 3) {
    store.dispatch('delUserInfo');
    router.push({name: 'login'});
  } else if (res.body.code === 5) {
    router.push({name: 'home'});
  } else if (res.body.code === 4) {
    return Promise.reject(res.body.Message.err);
  } else {
    return Promise.resolve(res.body.Message);
  }
}

function get(url, query) {
  return request
    .get(url)
    .query(query)
    .then(function (res) {
      return handleResponse(res);
    });
}

function post(url, body) {
  return request
    .post(url)
    .send(body)
    .then(function (res) {
      return handleResponse(res);
    });
}

function put(url, body) {
  return request
    .put(url)
    .send(body)
    .then(function (res) {
      return handleResponse(res);
    });
}

function del(url, body) {
  return request
    .del(url)
    .send(body)
    .then(function (res) {
      return handleResponse(res);
    });
}




