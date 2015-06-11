
angular.module('phavr.nav', [])
.controller('NavCtrl', function($scope, $rootScope, $location, $http, $ionicSideMenuDelegate, Auth, Favors, PushFactory,geo){ 

  /**
   * Description
   * @method getUserInfo
   * @param {} callback
   * @return 
   */
  $scope.getUserInfo = function(callback) {

    Auth.getUserInfo()
      .then(function(data){
        $scope.user = data;
        if(callback) callback();
      })
  };
  /**
   * Description
   * @method toggleLeft
   * @return 
   */
  $scope.toggleLeft = function() {
    $scope.getUserInfo(function(){$ionicSideMenuDelegate.toggleLeft();});
  };

  /**
   * Description
   * @method profile
   * @return 
   */
  $scope.profile = function() {
    $location.path('/profile');
  }; 

  /**
   * Description
   * @method logOut
   * @return CallExpression
   */
  $scope.logOut = function(){
    window.localStorage.removeItem("token");
    $rootScope.login = false;
    $ionicSideMenuDelegate.toggleLeft();
    $location.path("/");

  };


  $rootScope.toggleGeo = "Enable";
  /**
   * Description
   * @method toggleGeotracking
   * @return 
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

