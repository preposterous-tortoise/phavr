angular.module('drakeApp.login', [])
.controller('loginCtrl', function ($scope, $location, $cordovaOauth, Auth, $http){
  
  $scope.information = [$scope.username, $scope.password];
  $scope.letsGo = function(){
  	return $http({
      method: 'POST',
      url: '/login',
      data: $scope.information
    })
  };

  $scope.fbLogin = function() {
    /*return $http({
      method: 'GET',
      url: 'http://drakeapp.herokuapp.com/auth/facebook'
    })
    .success(function(data, status, headers, config) {
      console.log('success!');
      console.log('data', data);
      console.log('status', status);
      console.log('headers', headers);
      console.log('config', config);
    })
    .error(function(data, status, headers, config) {
      console.log('error!');
    });*/
    console.log('clicked!');
    console.log(Auth.clientID);
    $cordovaOauth.facebook(Auth.clientID, ['user_friends'])
      .then(function(result) {
        console.log('success!');
        console.log(result);
        $scope.accessToken = result.access_token;
        $http.get("https://graph.facebook.com/v2.2/me", 
                  { params: { access_token: $scope.accessToken, 
                    fields: "id, name, picture", format: "json" }})
                  .then(function(result) {
                      console.log(JSON.stringify(result));
                      //$scope.profileData = result.data;
                      $http.post('/auth/facebook', result)
                        .success(function(data){
                        return data;
                        })
                       .error(function(data){
                        return data;
                       }); 
                    }, function(error) {
                      alert("There was a problem getting your profile.  Check the logs for details.");
                      console.log(error);
                  });
        
      },
      function(error) {
           console.log('error logging in!')
           console.log(error);
      });
  };

});

