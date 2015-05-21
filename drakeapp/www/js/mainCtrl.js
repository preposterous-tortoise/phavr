angular.module('drakeApp.nav', [])
.controller('navCtrl', function($scope, $location, $ionicSideMenuDelegate){ 
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

});

