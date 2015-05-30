angular.module('drakeApp.nav', [])
.controller('navCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, photoFactory, Auth, Nav){ 
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.user

  $scope.getUserInfo = function() {
    return $http({
            method: 'GET',
            url: 'http://drakeapp.herokuapp.com/api/profileID?access_token='+Auth.accessToken
        })
        .then(function(resp) {
            console.log('response from getting server', resp);
            $scope.user = resp;
            return resp;
        });
  };

   

});

