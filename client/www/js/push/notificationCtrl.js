 angular.module('phavr.notification', [])
.controller('notificationCtrl', function ($scope, $rootScope, $location, PushFactory){
  
  // $scope.notifications = [];
  // for (var i = 0; i < 5; i++) {
  // 	$scope.notifications.push("Notification" + i);
  // }
  PushFactory.setScope($scope);
  for (var i = 0; i < 5; i++) {
  	$scope.notifications.push("Notification" + i);
  }



});

