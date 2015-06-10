angular.module('phavr.pushfact', [])
  .factory('PushFactory', function($cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $http) {

    var regId;
    var user_provider_id;
    var scope;
    var notifications = [];

    /**
     * Description
     * @method onNotificationGCM
     * @param {} notification
     * @return 
     */
    window.onNotificationGCM = function(notification) {
      console.log('onNotificationGCM called: ', notification);
      if (ionic.Platform.isAndroid()) {
        handleAndroid(notification);
      } else if (ionic.Platform.isIOS()) {
        handleIOS(notification);
        /*$scope.$apply(function () {
            $scope.notifications.push(JSON.stringify(notification.alert));
        })*/
      }
    };

    /**
     * Description: regiester for 
     * @method register
     * @param {} provider_id
     * @return 
     */
    var register = function(provider_id) {
      var config = null;
      user_provider_id = provider_id;

      if (ionic.Platform.isAndroid()) {
        config = {
          "senderID": "659702567252", // REPLACE THIS WITH YOUR GCM senderID
          'ecb': 'onNotificationGCM'
        };
      } else if (ionic.Platform.isIOS()) {
        config = {
          "badge": "true",
          "sound": "true",
          "alert": "true"
        }
      }

      $cordovaPush.register(config).then(function(result) {

        $cordovaToast.showShortCenter('Registered for push notifications');
        // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
        if (ionic.Platform.isIOS()) {
          regId = result;
          storeDeviceToken("ios");
        }
      }, function(err) {
        console.log("Register error " + err)
      });
      notifications = JSON.parse(window.localStorage.getItem("notifications"));
      notifications = notifications || [];
    }

    // Notification Received
    // This is the official documented way, but it does not work
    /*$scope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      console.log("NOTIFICATION RECEIVED.");
      console.log(JSON.stringify([notification]));
      if (ionic.Platform.isAndroid()) {
        handleAndroid(notification);
      } else if (ionic.Platform.isIOS()) {
        handleIOS(notification);
        $scope.$apply(function() {
          $scope.notifications.push(JSON.stringify(notification.alert));
        })
      }
    });*/

    // Android Notification Received Handler
    /**
     * Description
     * @method handleAndroid
     * @param {} notification
     * @return 
     */
    var handleAndroid = function(notification) {
      // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
      //             via the console fields as shown.
      console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
      if (notification.event == "registered") {
        regId = notification.regid;
        storeDeviceToken("android");
      } else if (notification.event == "message") {
        console.log("Push Notification Received", JSON.stringify(notification.message, null, '\t'));
        $cordovaDialogs.alert(notification.message, "Push Notification Received");
        if (scope) {
          scope.$apply(function() {
            scope.notifications.push(notification.message);
          })
        } else {
          notifications.push(notification.message);
        }
        window.localStorage.setItem("notifications", JSON.stringify(notifications));
      } else if (notification.event == "error")
        $cordovaDialogs.alert(notification.msg, "Push notification error event");
      else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
    }

    // IOS Notification Received Handler
    /**
     * Description
     * @method handleIOS
     * @param {} notification
     * @return 
     */
    function handleIOS(notification) {
      // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
      // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
      // the notification when this code runs (weird).
      if (notification.foreground == "1") {
        // Play custom audio if a sound specified.
        if (notification.sound) {
          var mediaSrc = $cordovaMedia.newMedia(notification.sound);
          mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
        }

        if (notification.body && notification.messageFrom) {
          $cordovaDialogs.alert(notification.body, notification.messageFrom);
        } else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

        if (notification.badge) {
          $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
            console.log("Set badge success " + result)
          }, function(err) {
            console.log("Set badge error " + err)
          });
        }
      }
      // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
      // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
      // the data in this situation.
      else {
        if (notification.body && notification.messageFrom) {
          $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
        } else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
      }
    }

    /**
     * Description: Stores the device token in a db using node-pushserver
     * @method storeDeviceToken
     * @param {String} type - Platform type (ios, android etc)
     * @return 
     */
    function storeDeviceToken(type) {
      // Create a random userid to store with it
      var user = {
        user: user_provider_id,
        type: type,
        token: regId
      };
      console.log("Post token for registered device with data " + JSON.stringify(user));
      $http.post('http://phavr-push.herokuapp.com/subscribe', JSON.stringify(user))
        .success(function(data, status) {
          console.log("Token stored, device is successfully subscribed to receive push notifications.");
        })
        .error(function(data, status) {
          console.log("Error storing device token." + data + " " + status)
        });
    }

    // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
    // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
    // time the app opens which this currently does. However in many cases you will always receive the same device token as
    // previously so multiple userids will be created with the same token unless you add code to check).
    /**
     * Description
     * @method removeDeviceToken
     * @return 
     */
    function removeDeviceToken() {
      var tkn = {
        "token": regId
      };
      $http.post('http://phavr-push.herokuapp.com/unsubscribe', JSON.stringify(tkn))
        .success(function(data, status) {
          console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
        })
        .error(function(data, status) {
          console.log("Error removing device token." + data + " " + status)
        });
    }

    // Unregister - Unregister your device token from APNS or GCM
    // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
    //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
    //
    // ** Instead, just remove the device token from your db and stop sending notifications **
    /**
     * Description
     * @method unregister
     * @return 
     */
    var unregister = function() {
      console.log("Unregister called");
      removeDeviceToken();
      // $scope.registerDisabled=false;
      //need to define options here, not sure what that needs to be but this is not recommended anyway
      //        $cordovaPush.unregister(options).then(function(result) {
      //            console.log("Unregister success " + result);//
      //        }, function(err) {
      //            console.log("Unregister error " + err)
      //        });
    }

    return {
      /**
       * Description
       * @method init
       * @param {Number} provider_id
       * @return 
       */
      init: function(provider_id) {
        register(provider_id);

      },
      /**
       * Description
       * @method setScope
       * @param {Object} newScope
       * @return 
       */
      setScope: function(newScope) {
        scope = newScope;
        scope.notifications = notifications;
      }

    }
  });