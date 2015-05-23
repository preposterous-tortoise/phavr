angular.module('drakeapp.photoFactory', [])
.factory('photoFactory', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        //something with camera
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },

    sendPicture: function(imageURI) {
      $http.post('/api/photos/create', imageURI)
        .success(function(data, status, headers, config) {
          console.log('photo uploaded!');
        })
        .error(function(data, status, headers, config) {
        });
    }
  }
}]);
