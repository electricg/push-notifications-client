window.UI = function(store) {
  var $$ = document.querySelector.bind(document);

  var $subscribe = $$('#subscribe');
  var $subscribeWrapper = $$('#subscribe-wrapper');
  var $subscribeLabel = $$('#subscribe-label');
  var $notSupported = $$('#not-supported');
  var $output = $$('#output');
  var _this = this;

  this.notSupported = function(msg) {
    $notSupported.innerHTML = msg;
  };

  this.disable = function() {
    $subscribe.disabled = true;
  };

  this.enable = function() {
    $subscribe.disabled = false;
  };

  this.subscribed = function(data) {
    var o = store.get();
    if (o.status !== false) {
      data.id = o[data.endpoint];
    }
    _this.status('You are subscribed', data);
    $subscribeLabel.innerHTML = 'Unsubscribe';
  };

  this.unsubscribed = function() {
    _this.status('You are unsubscribed');
    $subscribeLabel.innerHTML = 'Subscribe';
  };

  this.showOutput = function(show) {
    if (show) {
      $output.style.display = 'block';
    }
    else {
      $output.style.display = '';
    }
  };

  this.status = function(title, msg) {
    _this.showOutput(true);
    var txt = title;
    if (msg) {
      txt += '\n' + JSON.stringify(msg, null, 2);
    }
    $output.innerHTML = txt;
  };

  this.load = function() {
    $subscribeWrapper.style.display = '';
    $notSupported.style.display = 'none';
  };

  this.action = function(cb) {
    $subscribe.addEventListener('click', function(event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      else {
        event.returnValue = false;
      }
      _this.showOutput(false);
      cb();
    });
  };
};