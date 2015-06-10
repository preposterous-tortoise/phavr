angular.module('phavr.authFactory',[])
.factory('Auth',function($location, $q, $http) {
  return {
    "clientID": "1443792965917018",
    "clientSecret": "7650cb7ec94fe197901a90d00d7da8c5",
    "callbackURL": "http://localhost:3000/auth/facebook/callback",

    //TODO: Take this out once we understand the repercussions 
    /**
     * Access token of the user
     */
    accessToken:null,
    /**
     * This function 
     * @method setAccessToken
     * @param {} token
     * @return 
     */
     //TODO: Also take this out once we understand the repercussions
    setAccessToken: function(token) {
      this.accessToken = token;
      window.localStorage.setItem("token", token);
    },
    /**
     * Get the user's info from the req.user in the back-end
     * @method getUserInfo
     * @return CallExpression
     */
    getUserInfo: function() {
      return $http({
              method: 'GET',
              url: localStorage.getItem('domain') + '/api/profileID'
          })
          .then(function(resp) {
              console.log('response from getting server', resp);
              return resp;
          });
    }
  }
});
