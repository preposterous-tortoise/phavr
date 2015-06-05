 angular.module('phavr.profile', [])
.controller('profileCtrl', function ($scope, $rootScope, Favors, $location, $cordovaOauth, Auth, $http, Nav){
    $rootScope.login = true;
  
  $scope.user;

  $scope.favors;

  $scope.getFavors = function() {
    Favors.profileFavors($scope.user)
      .then(function(data){
        console.log("THIS IS THE FAVORS FOR PROFILE "+ JSON.stringify(data));
        $scope.favors = data.data;
      })
  }


  
  $scope.getUserInfo = function() {
    console.log("YOLO!");
    Auth.getUserInfo()
      .then(function(data){
        $scope.user = data;
        console.log("HELLO! THIS IS USER "+JSON.stringify($scope.user));
      })
  };

  $scope.filter = '-createdAt';

  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  $scope.new = function() {
    $scope.filter = '-createdAt';
  };

  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }
  
  $scope.getFavors();

});

