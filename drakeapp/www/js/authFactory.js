

angular.module('drakeapp.authFactory',[])
	.factory('Auth',function($location, $q, $http) {
		return {
			"clientID": "1443792965917018",
			"clientSecret": "7650cb7ec94fe197901a90d00d7da8c5",
			"callbackURL": "http://localhost:3000/auth/facebook/callback",

			accessToken:null,
			setAccessToken: function(token) {
		  		this.accessToken = token;
				console.log("access token set");
		 	}
		}
	});