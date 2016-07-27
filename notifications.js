/* global ServiceWorkerRegistration */
window.Notifications = function(ui, s) {
  var isPushEnabled = false;

  function sendSubscriptionToServer(sub) {
    return s.sendSubscriptionToServer(sub);
  }
  function cancelSubscriptionFromServer(sub) {
    return s.cancelSubscriptionFromServer(sub);
  }

  this.init = function() {
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      ui.notSupported('Notifications not supported');
      return;
    }
    
    // Check the current Notification permission
    // If it's denied, it's a permanent block until the user changes the permission
    if (Notification.permission === 'denied') {
      ui.notSupported('The user has blocked notifications');
      return;
    }

    // Is push messaging supported?
    if (!('PushManager' in window)) {
      ui.notSupported('Push messaging not supported');
      return;
    }

    ui.load();

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        // Enable any UI which subscribes / unsubscribes from push messages
        ui.enable();

        if (!subscription) {
          // We aren't subscribed to push, so set UI to allow the user to enable push
          return;
        }

        // Keep your server in sync with the latest subscriptionId
        // var sub = JSON.parse(JSON.stringify(subscription));
        // return sendSubscriptionToServer(sub);

        // Set your UI to show they have subscribed for push messages
        var sub = JSON.parse(JSON.stringify(subscription));
        ui.subscribed(sub);
        isPushEnabled = true;
      })
      .catch(function(err) {
        console.error('Error during getSubscription()', err);
      });
    });
  };

  function subscribe() {
    // Disable the button so it can't be changed while we process the permission request
    ui.enable();

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      var _subscription;
      var _sub;
      // Subscribe the browser
      serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
      // Send the subscription.endpoint to the server to save it in the db
      .then(function(subscription) {
        _subscription = subscription;
        _sub = JSON.parse(JSON.stringify(subscription));
        return sendSubscriptionToServer(_sub);
      })
      // The subscription was successful, show it
      .then(function() {
        ui.subscribed(_sub);
        isPushEnabled = true;
      })
      .catch(function(err) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which  
          // means we failed to subscribe and the user will need  
          // to manually change the notification permission to  
          // subscribe to push messages  
          ui.status('Permission for Notifications was denied by the user');
          ui.disable();
        }
        else {
          // A problem occurred with the subscription; common reasons  
          // include network errors, and lacking gcm_sender_id and/or  
          // gcm_user_visible_only in the manifest.  
          ui.status('Unable to subscribe to push', err);
          _subscription.unsubscribe();
          ui.unsubscribed();
          isPushEnabled = false;
          ui.enable();
        }
      });
    });
  }

  function unsubscribe() {
    ui.disable();

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // To unsubscribe from push messaging, you need get the subscription object, which you can call unsubscribe() on
      serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        // Check we have a subscription to unsubscribe
        if (!subscription) {
          // No subscription object, so set the state to allow the user to subscribe to push
          ui.unsubscribed();
          isPushEnabled = false;
          return;
        }

        var sub = JSON.parse(JSON.stringify(subscription));

        // We have a subscription, so call unsubscribe on it
        subscription.unsubscribe()
        .then(function(successful) {
          if (successful) {
            ui.unsubscribed();
            isPushEnabled = false;
            ui.enable();

            // Make a request to your server to remove
            // the subscriptionId from your data store so you
            // don't attempt to send them push messages anymore.
            // The client doesn't care about the success of this
            cancelSubscriptionFromServer(sub);
          }
        })
        .catch(function(err) {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove
          // the users data from your data store and
          // inform the user that you have done so

          console.error('Unsubscription error: ', err);
          ui.unsubscribed();
          ui.enable();
        });
      })
      .catch(function(err) {
        console.error('Error thrown while unsubscribing from push messaging.', err);
      });
    });
  }

  this.toggle = function() {
    if (isPushEnabled) {
      unsubscribe();
    }
    else {
      subscribe();
    }
  };
};