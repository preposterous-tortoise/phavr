angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory, Favors, $cordovaFile){

  $scope.takenPhoto;
  $scope.selectedFavor = Favors.selectedFavor;
  $scope.instagramPictures = [];
  $scope.arrays = [{id:1}, {id:2}];
  //how does this Favors.selectedFavor work (question from darren)
  console.log($scope.selectedFavor);
  
  $scope.requests = [
  ];

  $scope.getPhoto = function(){
      //AWS.config.update({ accessKeyId: 'AKIAIJKJ4NYIQ5ENZ6YA', secretAccessKey: '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' });
      //var bucket = new AWS.S3({ params: { Bucket: 'drakeapp-photos' } });
      console.log('getting picture...');
      photoFactory.getPicture().then(function(image){
        console.log(image);
        console.log('sending image...');
        $scope.takenPhoto = image;
        window.resolveLocalFileSystemURL(image,
          function(imageFile) {
            console.log('resolved photo!');
            console.log(imageFile);
            imageFile.file(function(file) { console.log(file); 
                              console.log('attemtping upload');
                              console.log(file);
                              /*var base64data = new Buffer(file, 'binary').toString('base64');
                              var params = { Key: 'someFile', ContentType: file.type, Body: base64data };
                              //photoFactory.sendPicture(file, $scope.selectedFavor._id);
                              bucket.putObject(params, function(err, data) {
                                if(err) { console.log('error', err);
                                } else { console.log('uploaded photo!');
                                }
                              });*/
                              
                              photoFactory.sendPicture(file, $scope.selectedFavor._id);
                          },   
                           function(err) { console.log(err); }
                          );
            //send photo and the request id to store to the database
            //photoFactory.sendPicture(imageFile, $scope.selectedFavor._id);
          },
          function(err) {
            console.log('error resolving photo');
          }
        );

      }, function(err) {
  		console.log('error during upload!!', err);
  	}, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    })
  };


  /*$scope.getInstagramPictures= function() {

    photoFactory.getInstagramPictures($scope.selectedFavor, function(data){

      $scope.requests = data.map(function(photo){
        return {photos: photo.images.standard_resolution.url};
      });


    });
  }*/

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
  //$scope.getInstagramPictures();


});
