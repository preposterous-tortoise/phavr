 angular.module('phavr.notification', [])
.controller('notificationCtrl', function ($scope, PushFactory){
  
  PushFactory.setScope($scope);

});

