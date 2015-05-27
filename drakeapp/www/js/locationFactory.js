angular.module('drakeapp.locationFactory', [])
.factory('geo', function($cordovaGeolocation) {


var processing = false;

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
      .then(function(spot) { callback(spot) });
    }
  }
});
