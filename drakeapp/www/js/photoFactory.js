

angular.module('drakeapp.photoFactory', [])
.factory('photoFactory', ['$q', '$http', function($q, $http) {

  
  return {
    stuff: {},
    getPicture: function(favorID) {

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
            console.log("onsuccess");
              var win = function (r) {
                console.log("win");
                  clearCache();
                  retries = 0;
                  alert('Done!');
              }
           
              var fail = function (error) {
                console.log("fail");
                  if (retries == 0) {
                    console.log("retry", retries);
                      retries ++
                      setTimeout(function() {
                          onCapturePhoto(fileURI)
                      }, 1000)
                  } else {
                    console.log("somethign wrong f'ed up");
                      retries = 0;
                      clearCache();
                      alert('Ups. Something wrong happens!');
                  }
              }
           
              var options = new FileUploadOptions();
              options.fileKey = "file";
              options.fileName = "fileURI.substr(fileURI.lastIndexOf('/') + 1)";
              options.mimeType = "image/jpeg";
              options.headers = {'favorID': favorID};
              options.params = {}; // if we need to send parameters to the server request
              var ft = new FileTransfer();

              ft.upload(fileURI, encodeURI("http://drakeapp.herokuapp.com/photoUploads/uploadToServer"), win, fail, options);
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


      // var q = $q.defer();
      // console.log('in the photoFactory...');
      // navigator.camera.getPicture(function(result) {
      //   //something with camera
      //   console.log(result);
      //   q.resolve(result);
      // }, function(err) {
      //   q.reject(err);
      // }, options);

      // return q.promise;
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
