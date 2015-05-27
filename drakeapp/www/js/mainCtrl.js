angular.module('drakeApp.nav', [])
.controller('navCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, photoFactory){ 
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.user
  
  $scope.getUserInfo = function() {
    return $http({
            method: 'GET',
            url: '/api/profileID'
        })
        .then(function(resp) {
            console.log('response from getting server', resp);
            $scope.user = resp;
            return resp;
        });
  };

   

});

