angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $location, Favors, photoFactory, geo){
 

  $scope.favors = [];
  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(favor) {
    favor.votes++;
    Favors.upVote(favor);
  }; 

  $scope.downVote = function(favor) {
    favor.votes--;
    Favors.downVote(favor);
  };

  $scope.favorDetails = function(favor){
    console.log(favor);
    Favors.setFavor(favor);
    $location.path('/favordetails');
  }

  $scope.updateFavors = function(){
    geo.getLocation(function(spot){
      console.log(spot);
      var radius = 0.289855;
      var box = [[spot[1]-radius, spot[0]-radius], [spot[1]+radius, spot[0]+radius]];
      console.log("THIS IS THE BOX " + box)
      Favors.fetchRequests(box, function(data){
        console.log("thisis")
        console.log(typeof data);
        console.log(data);
        $scope.favors = $scope.favors.concat(data);
        console.log($scope.favors[0]);
      })
    })
  };

  $scope.getPhoto = function(){
  	photoFactory.getPicture().then(function(image){
  		console.log(image);
      $scope.takenPhoto = image;
      photoFactory.sendPhoto(image);

  	}, function(err) {
  		console.log(err);
  	}, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    })
  };

  $scope.testVar = true;
  $scope.updateFavors();
});

