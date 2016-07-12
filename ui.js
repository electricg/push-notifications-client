window.UI = function() {
  var $$ = document.querySelector.bind(document);

  var $subscribe = $$('#subscribe');
  var $subscribeWrapper = $$('#subscribe-wrapper');
  var $subscribeLabel = $$('#subscribe-label');
  var $notSupported = $$('#not-supported');

  this.notSupported = function(msg) {
    $notSupported.innerHTML = msg;
  };

  this.disable = function() {
    $subscribe.disabled = true;
  };

  this.enable = function() {
    $subscribe.disabled = false;
  };

  this.subscribed = function() {
    $subscribe.checked = true;
    $subscribeLabel.innerHTML = 'Disable';
  };

  this.unsubscribed = function() {
    $subscribe.checked = false;
    $subscribeLabel.innerHTML = 'Enable';
  };

  this.load = function() {
    $subscribeWrapper.style.display = '';
    $notSupported.style.display = 'none';
  };

  this.action = function(cb) {
    $subscribe.addEventListener('click', cb);
  };
};