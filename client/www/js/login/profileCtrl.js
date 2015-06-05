 angular.module('phavr.profile', [])
.controller('profileCtrl', function ($scope, $rootScope, Favors, $location, $cordovaOauth, Auth, $http, Nav){
  
  $rootScope.login = true;

  $scope.getUserInfo = function() {
    Auth.getUserInfo()
      .then(function(data){
        $scope.user = data;
      })
  };


  $scope.getFavors = function() {
    Favors.profileFavors($scope.user)
      .then(function(data){
        $scope.favors = data.data;
      })
  }
  
  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }

  /**
  * Sorting my favors
  */
  $scope.filter = '-createdAt';

  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  $scope.new = function() {
    $scope.filter = '-createdAt';
  };


  /**
  * Initialize by getting favors
  */  
  $scope.getFavors();

});

