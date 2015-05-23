angular.module('drakeApp.favorfact', [])
.factory('Favors', function ($http, $location){
  return {
    //return all the favors within range of a location (sent as an obj)
    getFavors: function(loc) { 
      $http.post('/api/requests', loc)
        .success(function(data, status, headers, config) {
          //return the requests
        })
        .error(function(data, status, headers, config) {
          //handle error
        });
    }
  }
});

