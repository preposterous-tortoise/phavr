 angular.module('phavr.notification', [])
.controller('notificationCtrl', function ($scope, PushFactory, $cordovaDialogs){
  
  PushFactory.setScope($scope);

  $scope.showNotification = function(message) {
  	$cordovaDialogs.alert(message, "Notification");
  }

});

