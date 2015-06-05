angular.module('phavr.nav', [])
.controller('NavCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, Auth, Nav, Favors, PushFactory){ 
  $scope.user;
  $scope.getUserInfo = function(callback) {

    Favors.getUserInfo()
      .then(function(data){
        $scope.user = data;
        callback();
      })
  };
  $scope.toggleLeft = function() {
    $scope.getUserInfo(function(){$ionicSideMenuDelegate.toggleLeft();});
    
  };

  $scope.profile = function() {
    $location.path('/profile');
  }

  
   
});

