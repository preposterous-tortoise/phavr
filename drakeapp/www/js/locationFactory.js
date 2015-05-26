angular.module('drakeapp.locationFactory', [])
.factory('geo', function() {


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
        

    }
  }
});
