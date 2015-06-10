angular.module('phavr.nav', [])
.controller('NavCtrl', function($scope, $rootScope, $location, $http, $ionicSideMenuDelegate, Auth, Favors, PushFactory,geo){ 

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
  }; 

  $scope.logOut = function(){
    Auth.accessToken = null;
    return $http({
          method: 'GET',
          url: window.localStorage.getItem('domain') + '/logout',
        })
        .then($location.path('/'))
  };


  $rootScope.toggleGeo = "Enable";
  $scope.toggleGeotracking = function() {
    if($rootScope.toggleGeo === "Enable") {
      $rootScope.toggleGeo = "Disable";
      geo.backgroundTracking();
    } else {
      $rootScope.toggleGeo = "Enable";
      geo.stopBackGroundTracking();
    }
  }
   
  $scope.getUserInfo();



});

