window.Store = function(namespace) {
  namespace = namespace || 'pushNotificationId';

  this.set = function(obj) {
    var res;
    try {
      localStorage.setItem(namespace, JSON.stringify(obj));
      res = true;
    } catch(e) {
      console.error(e);
      res = false;
    }
    return res;
  };

  this.get = function() {
    var res;
    try {
      res = JSON.parse(localStorage.getItem(namespace));
    } catch(e) {
      console.error(e);
      res = {
        status: false,
        error: e
      };
    }
    return res;
  };

  this.remove = function() {
    var res;
    try {
      localStorage.removeItem(namespace);
      res = true;
    } catch(e) {
      console.error(e);
      res = false;
    }
    return res;
  };
};