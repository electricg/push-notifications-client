window.Subscription = function(remoteUrl) {
  var sendPost = function(opt) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('POST', opt.url, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      request.responseType = 'json';

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          resolve(request.response);
        } else {
          // We reached our target server, but it returned an error
          reject(request.response);
        }
      };

      request.onerror = function(err) {
        reject(err);
      };

      request.send(JSON.stringify(opt.data));
    });
  };

  var sendDelete = function(opt) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('DELETE', opt.url, true);
      request.responseType = 'json';

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          resolve(request.response);
        } else {
          // We reached our target server, but it returned an error
          reject(request.response);
        }
      };

      request.onerror = function(err) {
        reject(err);
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
        try {
          var o = {};
          o[sub.endpoint] = res.id;
          localStorage.setItem('pushNotificationId', JSON.stringify(o));
        } catch(e) {
          console.error(e);
        }
      }
      return res;
    });
  };

  this.cancelSubscriptionFromServer = function(sub) {
    var o = {};
    try {
      o = JSON.parse(localStorage.getItem('pushNotificationId'));
    } catch(e) {
      console.error(e);
      return Promise.reject(e);
    }
    var id = o[sub.endpoint];
    return sendDelete({
      url: remoteUrl + '/client/' + id
    })
    .then(function(res) {
      try {
        localStorage.removeItem('pushNotificationId');
      } catch(e) {
        console.error(e);
      }
      return res;
    });
  };
};