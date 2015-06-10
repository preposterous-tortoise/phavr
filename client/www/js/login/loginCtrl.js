angular.module('phavr.login', [])
.controller('loginCtrl', function ($scope, $rootScope, $location, $cordovaOauth, Auth, $http, Favors, PushFactory, Auth, geo){
    $rootScope.login = false;

  window.localStorage.setItem("domain", "");
  console.log("domain is: ", window.localStorage.getItem("domain"));

  ionic.Platform.ready(function() {
    var domain;
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid() || 
      $location.host() === 'phavr.herokuapp.com') {
      domain = "http://phavr.herokuapp.com";
    } else {
      domain = "http://localhost:3000";
    }
    Favors.setDomain(domain);
    window.localStorage.setItem("domain", domain);
    console.log('domain is: ', domain);
  });
  
  $scope.information = [$scope.username, $scope.password];
  /**
   * Description
   * @method letsGo
   * @return CallExpression
   */
  $scope.letsGo = function(){
  	return $http({
      method: 'POST',
      url: '/login',
      data: $scope.information
    })
  };

  $scope.toggle = false;

  /**
   * Description
   * @method setToggle
   * @return 
   */
  $scope.setToggle = function() {
    console.log('clicked!');
    $scope.toggle = !$scope.toggle;
    console.log($scope.toggle);
  }

  /**
   * Description
   * @method useBrowser
   * @return 
   */
  $scope.useBrowser = function() {
  //for browswer deployment use

    Auth.setAccessToken("CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU");
    $location.path('/home');
    console.log(localStorage.getItem('token'));
    Auth.getUserInfo()
      .then(function(data){
        // PushFactory.init(data.data.provider_id);
        localStorage.setItem('user_provider_id', data.data.provider_id);
        console.log('user data for authenticated user: ', JSON.stringify(data.data, null, '\t'));
        localStorage.setItem('user', JSON.stringify(data.data));
        // geo.updateUserLocation();
        console.log('Authenticated provider id: ', data.data.provider_id);
      });

 }

  /**
   * Description
   * @method fbLogin
   * @return 
   */
  $scope.fbLogin = function() {
    //get user access token
    $cordovaOauth.facebook(Auth.clientID, ['user_friends'])
      .then(function(result) {
        console.log('success!');
        console.log(result);


        //for android deployment use

        //set access token for the session
        Auth.setAccessToken(result.access_token);

        Auth.getUserInfo()
          .then(function(data){
            PushFactory.init(data.data.provider_id);
            localStorage.setItem('user_provider_id', data.data.provider_id);
            localStorage.setItem('user', JSON.stringify(data.data));
            console.log('user data for authenticated user: ', JSON.stringify(data.data, null, '\t'));
            geo.updateUserLocation();
            console.log('Authenticated provider id: ', data.data.provider_id);
          });

        //testing...
        $http.post('http://phavr.herokuapp.com/auth/facebook/token')
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

