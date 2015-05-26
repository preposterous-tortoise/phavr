angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory, Favors){

  $scope.takenPhoto;
  $scope.selectedFavor = Favors.selectedFavor;
  
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
      console.log('getting picture...');
      photoFactory.getPicture().then(function(image){
        console.log(image);
        console.log('sending image...');
        $scope.takenPhoto = image;
        //send photo and the request id to store to the database
        photoFactory.sendPicture(image, $scope.selectedFavor._id);

      }, function(err) {
  		console.log('error during upload!!', err);
  	}, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    })
  };


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

});
