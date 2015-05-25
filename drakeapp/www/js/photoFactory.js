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

    sendPicture: function(imageURI, favorID) {
      var data = { image: imageURI, favor_id: favorID };
      $http.post('/api/photos/create', data)
        .success(function(data, status, headers, config) {
          console.log('photo uploaded!');
        })
        .error(function(data, status, headers, config) {
          console.log('error during upload :[');
        });
    },
    upVote: function(photoID){
      return $http({
        method: 'POST',
        url: '/api/photos/upVote',
        data: photoID
      })
      .then(function(resp){
        console.log(resp);
      })
    },
    downVote: function(photoID){
      return $http({
        method: 'POST',
        url: '/api/photos/downVote',
        data: photoID
      })
      .then(function(resp){
        console.log(resp);
      }) 
    },
  }
}]);
