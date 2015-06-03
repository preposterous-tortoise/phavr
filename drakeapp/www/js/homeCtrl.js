angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $rootScope, $location, $http, Favors, photoFactory, geo, Nav){
 

  $rootScope.login = true;


  $scope.favors = [];
  
  //hard-coded requests for testing
  /*$scope.requests = [

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
    }];*/

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(favor) {
    console.log("THIS IS FAVOR "+JSON.stringify(favor));
    Favors.upVote(favor, 1);
  }; 

  $scope.downVote = function(favor) {
    Favors.downVote(favor, -1);
  };


  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }

  $scope.updateFavors = function(){
    console.log('attempting to update favors...');
    //geo.getLocation(function(spot){
    geo.phoneLocation(function(spot) {
        console.log('getting location');

        var radius = 0.289855;
        var box = [[spot.coords.longitude-radius, spot.coords.latitude-radius], [spot.coords.longitude+radius, spot.coords.latitude+radius]];
        $scope.currentLong = spot.coords.longitude;
        $scope.currentLat = spot.coords.latitude;
        console.log(box);

        Favors.fetchRequests(box, function(data){
          $scope.favors = data;
          $scope.favors.forEach(function(favor){
            favor.distance = $scope.getDistance(favor.loc);
          });


        });
      });
  };

  $scope.getDistance = function(locationObject) {
    var distance = geo.calculateDistance(locationObject.coordinates[1], locationObject.coordinates[0], $scope.currentLat, $scope.currentLong );
    console.log(distance);
    return distance;
  }

  $scope.enableTracking = function(){
    geo.enableTracking();
  }

  $scope.testVar = true;
  $scope.updateFavors();
});

