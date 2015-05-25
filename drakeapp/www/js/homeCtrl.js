angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $location, Favors, photoFactory){
 
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
      photos: [],
      hasPhotos: false,
      votes: 0
    }
  ];

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(request) {
    request.votes++;
    // drakeApp.favorfact.upVote(favorID);

  }; 

  $scope.downVote = function(request) {
    request.votes--;
    // drakeApp.favorfact.downVote(favorID);
  };

  $scope.favorDetails = function(request){
    console.log(request);
    Favors.setFavor(request);
    $location.path('/favordetails');
  }

  $scope.testVar = true;

});

