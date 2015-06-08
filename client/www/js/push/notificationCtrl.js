 angular.module('phavr.notification', [])
.controller('notificationCtrl', function ($scope, $rootScope, $location, PushFactory){
  
  PushFactory.setScope($scope);

});

