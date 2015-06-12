 angular.module('phavr.profile', [])
.controller('profileCtrl', function ($scope, $rootScope, Favors, $location, $cordovaOauth, Auth, $http){
  
  /**
   * Shows the header bar
   */
  $rootScope.login = true;

  /**
   * Get the user's info from the req.user in the back-end
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
   * Grabs the favors from that particular user
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
   * Choose and show the specific details of a particular favor
   * @method favorDetails
   * @param {} favor
   * @return 
   */
  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    $location.path('/favordetails');
  }

  /**
  * Sorting my favors
  */
  $scope.filter = '-createdAt';

  /**
   * Sort favors by the most votes
   * @method hot
   * @return 
   */
  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  /**
   * Sort favors by the most recent
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

