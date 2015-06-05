angular.module('phavr.locationFactory', [])
.factory('geo', function($cordovaGeolocation, mapService, Favors) {

  var bgGeo;
  var processing = false;
  var watchID = null;

  return {
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

      this.backgroundTracking();
    },

    backgroundTracking: function(){
      //start backgroundGeotracking
      bgGeo = window.plugins.backgroundGeoLocation;

      /**
      *  This is my callback for ajax-requests after POSTING background geolocation to my server
      */
      var myAjaxCallback = function(response) {
        bgGeo.finish();
      };

      /**
      *  This call back will be executed every time a geolocation is recorded in the background.
      */
      var callbackFn = function(location) {

        console.log('BackgroundGeoLocation callback:'+ location.latitude +',' + location longitude);
        //HTTP requeset here to Post Location to my server

        myAjaxCallback.call(this);
      }

      var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
      }


      bgGeo.configure(callbackFn, failureFn, {
        url: 'http://phavr.herokuapp.com/location',
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
    },

    stopBackGroundTracking: function() {
      bgGeo.stop();
    },



    phoneLocation: function(callback) {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function(spot) { 
        mapService.setLocation(spot.coords.latitude, spot.coords.longitude);
        callback(spot);
      });
    },

    calculateDistance: function(lat1, lon1, lat2, lon2, callback){

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


    enableTracking: function(callback){
      if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
      } else {


        // device APIs are available
        (function onDeviceReady() {
            // Throw an error if no update is received every 30 seconds
            var options = {   
              enableHighAccuracy: true,
              timeout: 30000 };
              watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
            }
            )();

        // onSuccess Geolocation
        //
        function onSuccess(position) {
          console.log( 'Latitude: '  + position.coords.latitude      + '<br />' +
            'Longitude: ' + position.coords.longitude     + '<br />' +
            '<hr />');

          var radius = 0.289855/2; //= 2 miles
          var box = [[position.coords.longitude-radius, position.coords.latitude-radius], [position.coords.longitude+radius, position.coords.latitude+radius]];

          Favors.fetchRequests(box, function(data){
            console.log('got requests');
            console.log(data);
          });

        }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
          alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
        }

      }
    }
  }
});
