angular.module('drakeApp.login', [])
.controller('loginCtrl', function ($scope, $location){
  
  $scope.information = [$scope.username, $scope.password];
  $scope.letsGo = function(){
  	return $http({
      method: 'POST',
      url: '/login',
      data: $scope.information
    })
  }

});

