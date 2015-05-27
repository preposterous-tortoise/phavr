

angular.module('drakeapp.photoFactory', [])
.factory('photoFactory', ['$q', '$http', function($q, $http) {

  
  return {
    stuff: {},
    getPicture: function(options) {
      var q = $q.defer();
      console.log('in the photoFactory...');
      navigator.camera.getPicture(function(result) {
        //something with camera
        console.log(result);
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },

    getInstagramPictures: function(favor, callback){

      var data = {
        lat: favor.loc.coordinates[1],
        long: favor.loc.coordinates[0]
      };
      
      $http.post('https://drakeapp.herokuapp.com/api/instagram/', data)
        .success(function(data, status, headers, config) {
          callback(data);
          console.log('got all instagram photos by location ');
        })
        .error(function(data, status, headers, config) {
          console.log('error getting instagram photos');
        });
    },

    sendPicture: function(imageURI, favorID) {
      var data = { image: imageURI, favor_id: favorID };
      $http.post('https://drakeapp.herokuapp.com/api/photos/create', data)
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
        url: 'http://drakeapp.herokuapp.com/api/photos/upVote',
        data: photoID
      })
      .then(function(resp){
        console.log(resp);
      })
    },
    downVote: function(photoID){
      return $http({
        method: 'POST',
        url: 'http://drakeapp.herokuapp.com/api/photos/downVote',
        data: photoID
      })
      .then(function(resp){
        console.log(resp);
      }) 
    },
  }
}]);
