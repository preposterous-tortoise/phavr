 angular.module('phavr.settings', [])
   .controller('settingsCtrl', function($scope, $http) {

     $scope.user = JSON.parse(window.localStorage.getItem('user'));

     console.log('settingsCtrl: ', JSON.stringify($scope.user, null, '\t'));

     /**
      * Description
      * @method saveSettings
      * @return 
      */
     $scope.saveSettings = function() {
       console.log('IN SAVE SETTINGS');
       localStorage.setItem('user', JSON.stringify($scope.user));
       $http({
           method: 'POST',
           url: localStorage.getItem('domain') + '/api/users/update',
           data: $scope.user
         })
         .success(function(data, status, headers, config) {
           return data;
         })
         .error(function(data, status, headers, config) {
           console.log('save settings error, ', data, status, headers, config);
         });
     };


   });