angular.module('phavr.nav', [])
.controller('NavCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, photoFactory, Auth, Nav, Favors, PushFactory){ 
  $scope.user;
  $scope.getUserInfo = function(callback) {
    console.log("YOLO!");
    Favors.getUserInfo()
      .then(function(data){
        $scope.user = data;
        //TODO - addback
        // PushFactory.init(data.data.provider_id);

        console.log("THIS IS DATA "+data)
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

