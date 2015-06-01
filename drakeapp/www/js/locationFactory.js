angular.module('drakeapp.locationFactory', [])
.factory('geo', function($cordovaGeolocation, mapService) {


var processing = false;
var watchID = null;

  return {
    getLocation: function(callback) {
    	if(processing) return;
    	processing = true;
        var lat ;
        var longi 
    	navigator.geolocation.getCurrentPosition( function(position){
    		processing = false;
            lat = position.coords.latitude;
            longi = position.coords.longitude;
            callback([lat, longi]);
    	});
    },

    phoneLocation: function(callback) {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function(spot) { 
        mapService.setLocation(spot.coords.latitude, spot.coords.longitude);
        callback(spot);
      });
    },


    enableTracking: function(callback){
      if (watchID != null) {
          console.log("watching disabled")
          navigator.geolocation.clearWatch(watchID);
          watchID = null;
      } else {
          console.log("enableTracking clicked");

            // device APIs are available
            //
            (function onDeviceReady() {
                // Throw an error if no update is received every 30 seconds
                var options = {   enableHighAccuracy: true,
  timeout: 30000 };
                watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
            })();

            // onSuccess Geolocation
            //
            function onSuccess(position) {
                console.log( 'Latitude: '  + position.coords.latitude      + '<br />' +
                                    'Longitude: ' + position.coords.longitude     + '<br />' +
                                    '<hr />');
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
