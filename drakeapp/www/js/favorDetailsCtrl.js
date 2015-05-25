angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory){

  $scope.takenPhoto;
  $scope.selectedRequest;
  
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
  	photoFactory.getPicture().then(function(image){
  		console.log(image)
      $scope.takenPhoto = image;
      return $http({
        method: 'POST',
        url: '/api/photos/create',
        data: image
      })
      .then(function(resp){
        console.log("This is the response from sending the photo! "+resp);
      })
      
  	}, function(err) {
  		console.log(err);
  	})
  };  

  $scope.upVote = function(request) {
    request.votes++;
    // drakeApp.favorfact.upVote(favorID);
  };

  $scope.downVote = function(request) {
    request.votes--;
    // drakeApp.favorfact.downVote(favorID);

  };

});
