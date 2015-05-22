angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $location){
 
  $scope.requests = [
    { 
      _id: 1,
      topic: 'LEMME SEE DRAKE',
      description: 'hey if somebody could take a pic of drake from the front row, that would be rad',
      photos: [],
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

  $scope.upVote = function(request) {
    request.votes++;
  }; 

  $scope.downVote = function(request) {
    request.votes--;
  };

  $scope.favorDetails = function(){
    $location.path('/favordetails');
  }

  $scope.testVar = true;

});

