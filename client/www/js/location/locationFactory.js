angular.module('phavr.locationFactory', [])
.factory('geo', function($cordovaGeolocation, mapService, Favors, $location, $http) {

  //Variable for background geolocation storage
  var bgGeo;
  //Processing variable to show if the location has already been acquired, starts as null
  var processing = false;
  //ID for background geotracking
  var watchID = null;

  var domain = localStorage.getItem("domain");
  // console.log("domain is: ", domain);

  return {
    /**
     * Get's the User's location through the native Geolocation API, sends back the data via a callback with latitude and longitide
     * @method getLocation
     * @param {} callback
     * @return 
     */
    getLocation: function(callback) {
    	if(processing) return;
    	processing = true;
      var lat, longi;
    	navigator.geolocation.getCurrentPosition( function(position){
    		processing = false;
        lat = position.coords.latitude;
        longi = position.coords.longitude;
        callback([lat, longi]);
    	});

    },

    /**
     * Background location tracking using PhoneGap cordova tracking
     * @method backgroundTracking
     * @return 
     */
    backgroundTracking: function() {
      //start backgroundGeotracking
      bgGeo = window.plugins.backgroundGeoLocation;

      /**
       *  This is my callback for ajax-requests after POSTING background geolocation to my server, stops background tracking
       * @method myAjaxCallback
       * @param {} response
       * @return 
       */
      var myAjaxCallback = function(response) {
        bgGeo.finish();
      };

      /**
       *  This call back will be executed every time a geolocation is recorded in the background.
       * @method callbackFn
       * @param {} location
       * @return 
       */
      var callbackFn = function(location) {

        // console.log('BackgroundGeoLocation callback:'+ location.latitude +',' + location.longitude);
        //HTTP requeset here to Post Location to my server

        myAjaxCallback.call(this);
      }

      /**
       * This is invoked when there is a failure with background tracking
       * @method failureFn
       * @param {} error
       * @return 
       */
      var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
      }

      /*
       * Settings for the background tracking
       */
      bgGeo.configure(callbackFn, failureFn, {
        url: 'http://phavr.herokuapp.com/api/users/updateloc',
        headers: {
          access_token: window.localStorage.getItem("token")
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking',
        notificationText: 'ENABLED',
        activityType: 'AutomotiveNavigation',
        debug:true,
        stopOnTerminal: false
      });

      bgGeo.start();
      // console.log("access token is", window.localStorage.getItem("token"));
    },

    /*
     * This stops Background Trcking 
     * @method stopBackGroundTracking
     * @return 
     */
    stopBackGroundTracking: function() {
      bgGeo.stop();
    },



    /*
     * Get's the User's location using Cordova/PhoneGap methods, send back data latitude and longitiude with 
     * a callback. Also saves the data in local storage. 
     * @method phoneLocation
     * @param {} callback
     * @return 
     */
    phoneLocation: function(callback) {
      var context = this;
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function(spot) { 
        mapService.setLocation(spot.coords.latitude, spot.coords.longitude);
        window.localStorage.setItem('longitude', spot.coords.longitude.toString());
        window.localStorage.setItem('latitude', spot.coords.latitude.toString());
        context.updateUserLocation();
        callback(spot);
      });
    },

    /**
     * Updates the User's Location in the database based on their longitude and Latitude stored in Local Storage
     * @method updateUserLocation
     * @return 
     */
    updateUserLocation: function() {
      var provider_id = localStorage.getItem('user_provider_id');
      var lat = localStorage.getItem('latitude');
      var lng = localStorage.getItem('longitude');
      console.log('updateUserLocation: ', provider_id, lat, lng);
      $http({
        method: 'POST',
        url: domain +'/api/users/updateloc',
        data: {lat: lat, lng: lng}
      })
      .success(function(data, status, headers, config) {
        console.log("successfully updated user location");
      })
      .error(function(data, status, headers, config) {
        console.log('error updating user location, ', data, status, headers, config);
      });
    },

    /**
     * This function calculates the distance between two geo-coordinates in miles
     * @method calculateDistance
     * @param {} lat1
     * @param {} lon1
     * @param {} lat2
     * @param {} lon2
     * @return BinaryExpression
     */
    calculateDistance: function(lat1, lon1, lat2, lon2) {

      /*
       * Inner function that converts degrees to radians
       * @method deg2rad
       * @param {} deg
       * @return BinaryExpression
       */
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d *0.621371; //distance in miles
    },


  }
});
