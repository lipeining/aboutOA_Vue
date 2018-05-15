const request = require('superagent');

export {get, post, put, del};

function handleResponse(res) {
  // console.log(res);
  if (res.body.code === 3) {
    this.$store.dispatch('delUserInfo')
      .then(()=>{
        this.$router.push({
          name: 'login'
        });
      });
  } else if (res.body.code === 4) {
    return Promise.reject(res.body.Message.err);
  } else {
    return res.body.Message;
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




