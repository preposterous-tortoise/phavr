angular.module('phavr.photoFactory', [])
.factory('Photos', ['$location', '$q', '$http', 'Auth', function($location, $q, $http, Auth) {

  var domain = localStorage.getItem("domain");
  console.log("domain is: ", domain);

  return {
    getPicture: function(favorID, time) {
          var Photos = this;
          console.log('get picture time', time);

          var pictureSource;   // picture source
          var destinationType; // sets the format of returned value
           
          document.addEventListener("deviceready", onDeviceReady, false);
           
          function onDeviceReady() {
              pictureSource = navigator.camera.PictureSourceType;
              destinationType = navigator.camera.DestinationType;
          }
           
          function clearCache() {
              navigator.camera.cleanup();
          }
           
          var retries = 0;
          function onCapturePhoto(fileURI) {

              var win = function (r) {
                  clearCache();
                  retries = 0;
                  alert('Done!');
                  Photos.sendPicture("https://s3.amazonaws.com/darrendrakeapp/"+time+"___"+favorID +".jpg", favorID);
              }
              var fail = function (error) {
                  if (retries == 0) {
                    console.log("retry", retries);
                      retries ++
                      setTimeout(function() {
                          onCapturePhoto(fileURI)
                      }, 1000)
                  } else {
                      retries = 0;
                      clearCache();
                      alert('Whoops. Problem encountered uploading photo! Try again!');
                  }
              }

              var options = new FileUploadOptions();
              options.fileKey = "file";
              options.fileName = time +"___"+favorID+".jpg";
              options.mimeType = "image/jpeg";
              var ft = new FileTransfer();
              ft.upload(fileURI, encodeURI("http://phavr.herokuapp.com/photoUploads/uploadToServer"), win, fail, options);
          }
           
          function capturePhoto() {
              navigator.camera.getPicture(onCapturePhoto, onFail, {
                  quality: 100,
                  destinationType: destinationType.FILE_URI
              });
          }
           
          function onFail(message) {
              alert('Failed because: ' + message);
          }

          capturePhoto();
    },

    getPhotosForFavor: function(favor, callback){
      $http.post(domain + '/api/photos/fetch', { favor_id: favor._id })
        .success(function(data, status, headers, config) {
          callback(data);
        })
        .error(function(data, status, headers, config) {
        });
    },
    sendPicture: function(imageURI, favorID) {
      var data = { image: imageURI, favor_id: favorID };
      $http.post(domain+'/api/photos/create', data)
        .success(function(data, status, headers, config) {
        })
        .error(function(data, status, headers, config) {
        });
    },
    upVote: function(photo, vote){
      console.log('auth',Auth)
      return $http({
        method: 'POST',
        url: domain+'/api/votes/upVotePhoto',
        data: {photo: photo, vote: vote}
      })
      .then(function(resp){
        photo.votes += +resp.data;
        console.log(resp);
      })
    },   
    getInstagramPictures: function(favor, callback){
      var data = {
        lat: favor.loc.coordinates[1],
        long: favor.loc.coordinates[0]
      };
      
      $http.post('https://phavr.herokuapp.com/api/instagram/', data)
        .success(function(data, status, headers, config) {
          callback(data);
        })
        .error(function(data, status, headers, config) {
        });
    }
  }
}]);
