angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory, Favors, $cordovaFile){

  $scope.selectedFavor = Favors.selectedFavor;

  
  $scope.getPhoto = function(){

    //TODO REPLACE FAVOR ID WITH APPROPRIATE FAVOR ID
    var d = new Date();
    var time = d.getTime();
    var favorID = $scope.selectedFavor._id;
    photoFactory.getPicture("1111111111111111111", time );
    photoFactory.sendPicture("https://s3.amazonaws.com/darrendrakeapp/"+time+"___"+favorID +".jpg")

  };


  $scope.getInstagramPictures= function() {

    photoFactory.getInstagramPictures($scope.selectedFavor, function(data){

      $scope.requests = data.map(function(photo){
        return {photos: photo.images.standard_resolution.url};
      });


    });
  }

  $scope.getAllPhotos = function() {

    console.log($scope.selectedFavor);

  }

  $scope.upVote = function(request) {
    request.votes++;
    // Favors.upVote(favorID);
  };

  $scope.downVote = function(request) {
    request.votes--;
    // Favors.downVote(favorID);

  };

  $scope.upVotePhoto = function(photo) {
    request.votes++;
    // photoFactory.upVote(photo.ID);
  };

  $scope.downVotePhoto = function(photo) {
    request.votes--;
    // photoFactory.downVote(photo.ID);

  };

  //get instagram pictures
  // $scope.getInstagramPictures();
  $scope.getAllPhotos();


});










/*
angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory, Favors, $cordovaFile){

  $scope.takenPhoto;
  $scope.selectedFavor = Favors.selectedFavor;
  $scope.instagramPictures = [];
  $scope.arrays = [{id:1}, {id:2}];
  //how does this Favors.selectedFavor work (question from darren)
  console.log($scope.selectedFavor);
  
  $scope.requests = [
    { 
          _id: 1,
          topic: 'LEMME SEE DRAKE',
          description: 'hey if somebody could take a pic of drake from the front row, that would be rad',
          photos: ["http://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/838px-Golden_State_Warriors_logo.svg.png"],
          hasPhotos: false,
          votes: 0
        },
        {
          _id: 2,
          topic: 'black tshirt',
          description: 'take a picture of somebody wearing a black t-shirt plz',
          photos: ["http://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/838px-Golden_State_Warriors_logo.svg.png"],
          hasPhotos: false,
          votes: 0
        }



  ];

  $scope.getPhoto = function(){

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
        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = {}; // if we need to send parameters to the server request
        var ft = new FileTransfer();

        // AWS.config.update({ accessKeyId: 'AKIAIUQEZVPM62OXQ2WQ', secretAccessKey: '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' });
        // var bucket = new AWS.S3({ params: { Bucket: 'darrendrakeapp' } });
        options.params = {

          "AWSAccessKeyId": "AKIAIUQEZVPM62OXQ2WQ",
        };
        ft.upload(fileURI, encodeURI("https://darrendrakeapp.s3.amazonaws.com/"), win, fail, options);
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

console.log("picture fired");
    capturePhoto();

      //AWS.config.update({ accessKeyId: 'AKIAIJKJ4NYIQ5ENZ6YA', secretAccessKey: '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' });
      //var bucket = new AWS.S3({ params: { Bucket: 'drakeapp-photos' } });
   //    console.log('getting picture...');
   //    photoFactory.getPicture().then(function(image){
   //      console.log(image);
   //      console.log('sending image...');
   //      $scope.takenPhoto = image;
   //      window.resolveLocalFileSystemURL(image,
   //        function(imageFile) {
   //          console.log('resolved photo!');
   //          console.log(imageFile);
   //          imageFile.file(function(file) { console.log(file); 
   //                            console.log('attemtping upload');
   //                            console.log(file);
   //                            // var base64data = new Buffer(file, 'binary').toString('base64');
   //                            // var params = { Key: 'someFile', ContentType: file.type, Body: base64data };
   //                            // //photoFactory.sendPicture(file, $scope.selectedFavor._id);
   //                            // bucket.putObject(params, function(err, data) {
   //                            //   if(err) { console.log('error', err);
   //                            //   } else { console.log('uploaded photo!');
   //                            //   }
   //                            // });
                              
   //                            photoFactory.sendPicture(file, $scope.selectedFavor._id);
   //                        },   
   //                         function(err) { console.log(err); }
   //                        );
   //          //send photo and the request id to store to the database
   //          //photoFactory.sendPicture(imageFile, $scope.selectedFavor._id);
   //        },
   //        function(err) {
   //          console.log('error resolving photo');
   //        }
   //      );

   //    }, function(err) {
    //  console.log('error during upload!!', err);
    // }, {
   //    quality: 75,
   //    targetWidth: 320,
   //    targetHeight: 320,
   //    saveToPhotoAlbum: false
   //  })
  };


  $scope.getInstagramPictures= function() {

    photoFactory.getInstagramPictures($scope.selectedFavor, function(data){

      $scope.requests = data.map(function(photo){
        return {photos: photo.images.standard_resolution.url};
      });


    });
  }

  $scope.upVote = function(request) {
    request.votes++;
    // Favors.upVote(favorID);
  };

  $scope.downVote = function(request) {
    request.votes--;
    // Favors.downVote(favorID);

  };

  $scope.upVotePhoto = function(photo) {
    request.votes++;
    // photoFactory.upVote(photo.ID);
  };

  $scope.downVotePhoto = function(photo) {
    request.votes--;
    // photoFactory.downVote(photo.ID);

  };

  //get instagram pictures
  // $scope.getInstagramPictures();


});
*/

