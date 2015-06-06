angular.module('phavr.nav', [])
.controller('NavCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, Auth, Favors, PushFactory){ 

  $scope.getUserInfo = function(callback) {

    Auth.getUserInfo()
      .then(function(data){
        $scope.user = data;
        if(callback) callback();
      })
  };
  $scope.toggleLeft = function() {
    $scope.getUserInfo(function(){$ionicSideMenuDelegate.toggleLeft();});
  };

  $scope.profile = function() {
    $location.path('/profile');
  } 
   
  $scope.getUserInfo();
});

