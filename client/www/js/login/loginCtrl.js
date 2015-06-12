angular.module('phavr.login', [])
.controller('loginCtrl', function ($scope, $ionicHistory, $rootScope, $location, $cordovaOauth, Auth, $http, Favors, PushFactory, Auth, geo){
  
  /**
   * Takes out the header bar
   */
  $rootScope.login = false;
  console.log("token", window.localStorage.getItem("token"));

  window.localStorage.setItem("domain", "");

  /*
   * Checks the environment the app is running in. Whether it be a phone or inside a browser
   */

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


    if(window.localStorage.getItem("token")) {
    Auth.setAccessToken(window.localStorage.getItem("token"));

    Auth.getUserInfo()
      .then(function(data){
        localStorage.setItem('user_provider_id', data.data.provider_id);
        localStorage.setItem('user', JSON.stringify(data.data));

      });
    //$location.path('/home');
    } 

    $ionicHistory.nextViewOptions({
      historyRoot: true;
    });







  /**
   * The function allows for browser deployment and use
   * @method useBrowser
   * @return 
   */
  $scope.useBrowser = function() {
    $rootScope.login = true;
    Auth.setAccessToken("CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU");
    $location.path('/home');
    console.log(localStorage.getItem('token'));
    Auth.getUserInfo()
      .then(function(data){
        localStorage.setItem('user_provider_id', data.data.provider_id);
        localStorage.setItem('user', JSON.stringify(data.data));
      });

 }

  /**
   * Function allows for Facebook login using cordova
   * @method fbLogin
   * @return 
   */
  $scope.fbLogin = function() {

  // $rootScope.login = true;


    $cordovaOauth.facebook(Auth.clientID, ['user_friends'])
      .then(function(result) {

        //set access token for the session
        Auth.setAccessToken(result.access_token);

        Auth.getUserInfo()
          .then(function(data){
            PushFactory.init(data.data.provider_id);
            localStorage.setItem('user_provider_id', data.data.provider_id);
            localStorage.setItem('user', JSON.stringify(data.data));
            geo.updateUserLocation();
          });

        $http.post('http://phavr.herokuapp.com/auth/facebook/token')
          .success(function(data){
            $location.path('/home');
          })
         .error(function(data){
            console.log('error!')
        });

      }, function(error) {
          alert("There was a problem getting your profile. Check the logs for details.");
          console.log(error);
      });
    
  };

});

