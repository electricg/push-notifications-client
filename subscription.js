window.Subscription = function(remoteUrl, authHeader, store) {
  var sendPost = function(opt) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', opt.url, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      request.responseType = 'json';

      request.onload = function() {
        if (request.status === 200) {
          // Success!
          resolve(request.response);
        } else {
          // We reached our target server, but it returned an error
          reject({
            code: request.status,
            message: request.response
          });
        }
      };

      request.onerror = function() {
        reject({
          message: 'An error occurred while trying to contact the registration server'
        });
      };

      request.send(JSON.stringify(opt.data));
    });
  };

  var sendDelete = function(opt) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('DELETE', opt.url, true);
      request.setRequestHeader('Authorization', opt.auth);
      request.responseType = 'json';

      request.onload = function() {
        if (request.status === 200) {
          // Success!
          resolve(request.response);
        } else {
          // We reached our target server, but it returned an error
          reject({
            code: request.code,
            message: request.response
          });
        }
      };

      request.onerror = function() {
        reject({
          message: 'An error occurred while trying to contact the registration server'
        });
      };

      request.send();
    });
  };

  this.sendSubscriptionToServer = function(sub) {
    return sendPost({
      url: remoteUrl + '/clients',
      data: sub
    })
    .then(function(res) {
      if (res.status === 1 && res.id) {
        var o = {};
        o[sub.endpoint] = res.id;
        store.set(o);
      }
      return res;
    });
  };

  this.cancelSubscriptionFromServer = function(sub) {
    var o = store.get();
    if (o.status === false) {
      return Promise.reject(o.error);
    }
    var id = o[sub.endpoint];
    return sendDelete({
      url: remoteUrl + '/client/' + id,
      auth: authHeader + 'endpoint=' + sub.endpoint + ',p256dh=' + sub.keys.p256dh + ',auth=' + sub.keys.auth 
    })
    .then(function(res) {
      store.remove();
      return res;
    });
  };
};