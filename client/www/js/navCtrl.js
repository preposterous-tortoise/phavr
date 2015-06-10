angular.module('phavr.nav', [])
.controller('NavCtrl', function($scope, $rootScope, $location, $http, $ionicSideMenuDelegate, Auth, Favors, PushFactory,geo) {

  /**
   * fetch user's information
   * @method getUserInfo
   * @param {} callback
   */

  $scope.getUserInfo = function(callback) {
    Auth.getUserInfo()
    .then(function(data){
      $scope.user = data;
      if(callback) callback();
    });
  };

  /**
   * toggle the side menu
   * @method toggleLeft
   */

  $scope.toggleLeft = function() {
    $scope.getUserInfo(function() {
      $ionicSideMenuDelegate.toggleLeft();
    });
  };

  /**
   * redirect to the user profile
   * @method profile
   */

  $scope.profile = function() {
    $location.path('/profile');
  }; 

  /**
   * log out user
   * @method logOut
   */

  $scope.logOut = function() {
    Auth.accessToken = null;
    return $http({
          method: 'GET',
          url: window.localStorage.getItem('domain') + '/logout',
        })
        .then($location.path('/'))
  };

  $rootScope.toggleGeo = "Enable";

  /**
   * geo-tracking
   * @method toggleGeotracking
   */

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

