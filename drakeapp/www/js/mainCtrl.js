angular.module('drakeApp.nav', [])
.controller('navCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, photoFactory, Auth, Nav, Favors){ 
  $scope.user;
  $scope.getUserInfo = function(callback) {
    console.log("YOLO!");
    Favors.getUserInfo()
      .then(function(data){
        $scope.user = data;
        console.log("THIS IS DATA "+data)
        callback();
      })
  };
  $scope.toggleLeft = function() {
    $scope.getUserInfo(function(){$ionicSideMenuDelegate.toggleLeft();});
    
  };

  
   

});

