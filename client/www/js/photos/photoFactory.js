angular.module('phavr.photoFactory', [])
.factory('Photos', ['$location', '$q', '$http', 'Auth', function($location, $q, $http, Auth) {

  //For production or development purposes
  var domain = localStorage.getItem("domain") || "http://phavr.herokuapp.com";
  console.log("domain is: ", domain);

  return {
    /**
     * Uploads picture taken from client's mobile dvice to server
     * @method getPicture
     * @param {Integer} favorID
     * @param {Integer} time
     * @return 
     */
    getPicture: function(favorID, time) {
          var Photos = this;
          console.log('get picture time', time);

          var pictureSource;   // picture source
          var destinationType; // sets the format of returned value
           
          document.addEventListener("deviceready", onDeviceReady, false);
           
          /**
           * Function is invoked when device is ready
           * @method onDeviceReady
           * @return 
           */
          function onDeviceReady() {
              pictureSource = navigator.camera.PictureSourceType;
              destinationType = navigator.camera.DestinationType;
          }
           
          /**
           * Clear's camera cache
           * @method clearCache
           * @return 
           */
          function clearCache() {
              navigator.camera.cleanup();
          }
           
          var retries = 0;

          /** 
           *Function is inoved when picture is taken
           * @method onCapturePhoto
           * @param {} fileURI
           * @return 
           */
          function onCapturePhoto(fileURI) {

              /**
               * Function is called when photo is successfuly sent to server
               * @method win
               * @param {Integer} r
               * @return 
               */
              var win = function (r) {
                  clearCache();
                  retries = 0;
                  alert('Done!');
                  //Tell sever to save Photo url in photo databse
                  Photos.sendPicture("https://s3.amazonaws.com/darrendrakeapp/"+time+"___"+favorID +".jpg", favorID);
              }
              /**
               * Is called if photo fails to be sent to server
               * @method fail
               * @param {Object} error
               * @return 
               */
              var fail = function (error) {
                  if (retries == 0) {
                      //increment number of retries if failed
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
              //file transfer photo to server
              ft.upload(fileURI, encodeURI("http://phavr.herokuapp.com/photoUploads/uploadToServer"), win, fail, options);
          }
           
          /**
           * Takes picture from the mobile device
           * @method capturePhoto
           * @return 
           */
          function capturePhoto() {
              //get photo from phone
              navigator.camera.getPicture(onCapturePhoto, onFail, {
                  quality: 100,
                  destinationType: destinationType.FILE_URI
              });
          }
           
          /**
           * If error occurs when taking a phone with phone
           * @method onFail
           * @param {String} message
           * @return 
           */
          function onFail(message) {
              alert('Failed because: ' + message);
          }

          //invoke photo taking
          capturePhoto();
    },

    /**
     * Make request for all photos for a given favor id
     * @method getPhotosForFavor
     * @param {Object} favor
     * @param {Function} callback
     * @return 
     */
    getPhotosForFavor: function(favor, callback) {
      $http.post(domain + '/api/photos/fetch', { favor_id: favor._id })
        .success(function(data, status, headers, config) {
          callback(data);
        })
        .error(function(data, status, headers, config) {
        });
    },
    /**
     * Tells server to create a new photo has been created by passing the image uri
     * @method sendPicture
     * @param {String} imageURI
     * @param {Integer} favorID
     * @return 
     */
    sendPicture: function(imageURI, favorID) {
      var data = { image: imageURI, favor_id: favorID };
      $http.post(domain+'/api/photos/create', data)
        .success(function(data, status, headers, config) {
        })
        .error(function(data, status, headers, config) {
        });
    },
    /**
     * Tells server to register new vote for a photo
     * @method upVote
     * @param {Object} photo
     * @param {Integer} vote
     * @return CallExpression
     */
    upVote: function(photo, vote) {

      return $http({
        method: 'POST',
        url: domain+'/api/votes/upVotePhoto',
        data: {photo: photo, vote: vote}
      })
      .then(function(resp){
        photo.votes += +resp.data;
      })
    },   

    /**
     * Instagram API call to retrieve photos for a given location 
     * @method getInstagramPictures
     * @param {Favor} favor
     * @param {Function} callback
     * @return 
     */
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
