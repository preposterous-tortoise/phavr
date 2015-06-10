 angular.module('phavr.profile', [])
.controller('profileCtrl', function ($scope, $rootScope, Favors, $location, $cordovaOauth, Auth, $http){
  
  $rootScope.login = true;

  /**
   * Description
   * @method getUserInfo
   * @return 
   */
  $scope.getUserInfo = function() {
    Auth.getUserInfo()
      .then(function(data){
        $scope.user = data;
      })
  };


  /**
   * Description
   * @method getFavors
   * @return 
   */
  $scope.getFavors = function() {
    Favors.profileFavors($scope.user)
      .then(function(data){
        $scope.favors = data.data;
      })
  }
  
  /**
   * Description
   * @method favorDetails
   * @param {} favor
   * @return 
   */
  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }

  /**
  * Sorting my favors
  */
  $scope.filter = '-createdAt';

  /**
   * Description
   * @method hot
   * @return 
   */
  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  /**
   * Description
   * @method new
   * @return 
   */
  $scope.new = function() {
    $scope.filter = '-createdAt';
  };


  /**
  * Initialize by getting favors
  */  
  $scope.getFavors();

});

