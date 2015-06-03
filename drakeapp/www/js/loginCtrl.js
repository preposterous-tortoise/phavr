angular.module('drakeApp.login', [])
.controller('loginCtrl', function ($scope, $rootScope, $location, $cordovaOauth, Auth, $http, Nav){
    $rootScope.login = false;
  
  $scope.information = [$scope.username, $scope.password];
  $scope.letsGo = function(){
  	return $http({
      method: 'POST',
      url: '/login',
      data: $scope.information
    })
  };

  $scope.toggle = false;

  $scope.setToggle = function() {
    console.log('clicked!');
    $scope.toggle = !$scope.toggle;
    console.log($scope.toggle);
  }

  $scope.useBrowser = function() {
  //for browswer deployment use

    Auth.setAccessToken("CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU");
    $location.path('/home');
    console.log(localStorage.getItem('token'));

 }

  $scope.fbLogin = function() {
    //get user access token
    $cordovaOauth.facebook(Auth.clientID, ['user_friends'])
      .then(function(result) {
        console.log('success!');
        console.log(result);


        //for android deployment use

        //set access token for the session
        Auth.setAccessToken(result.access_token);

        //testing...
        $http.post('http://drakeapp.herokuapp.com/auth/facebook/token')
          .success(function(data){
            console.log(data);
            $location.path('/home');
          })
         .error(function(data){
            console.log('error!')
        });

      }, function(error) {
          alert("There was a problem getting your profile.  Check the logs for details.");
          console.log(error);
      });
        
  };

});

