angular.module('phavr', ['ionic', 'ngCordova', 'phavr.login', 'phavr.home', 'phavr.profile', 'phavr.nav', 
                          'phavr.favor', 'phavr.favorMap', 'phavr.favorDetails',
                          'phavr.photoFactory', 'phavr.favorfact', 'phavr.locationFactory',
                          'uiGmapgoogle-maps','phavr.mapService', 'phavr.favorCreationMap', 
                          'phavr.authFactory', 'phavr.nav',
                          'phavr.pushfact', 'phavr.notification', 'phavr.settings'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.run(function($rootScope, $ionicPlatform, $ionicHistory){
  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }

    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101);

})
.config(function(uiGmapGoogleMapApiProvider) {
  // asynchronously load the google maps api, as instructed by angular-google-maps.
  // (see their docs for reference)
  uiGmapGoogleMapApiProvider.configure({
    v: '3.17',
    libraries: 'places'
  });
})
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise('/')
  
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'views/home.html',
    controller: 'homeCtrl'
  })

  $stateProvider.state('favormap', {
    cache: false,
    url: '/favormap',
    templateUrl: './views/favorMap.html',
    controller: 'FavorMapCtrl'
  })

  $stateProvider.state('login', {
    url: '/',
    templateUrl: './views/login.html',
    controller: 'loginCtrl'
  })

  $stateProvider.state('favor', {
    cache: false,
    url: '/favor',
    templateUrl: './views/favor.html',
    controller: 'favorCtrl'
  })

  $stateProvider.state('favordetails', {
    cache: false,
    url: '/favordetails',
    templateUrl: './views/favorDetails.html',
    controller: 'favorDetailsCtrl'
  })

  $stateProvider.state('profile', {
    cache: false,
    url: '/profile',
    templateUrl: 'views/profile.html',
    controller: 'profileCtrl'
  })

  $stateProvider.state('notifications', {
    url: '/notifications',
    templateUrl: 'views/notification.html',
    controller: 'notificationCtrl'
  })

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'views/settings.html',
    controller: 'settingsCtrl'
  })

  //we add our $httpIntereceptor into the array of interceptors.
  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window){
  //middlewear to insert token for all outgoing requests
  var attach = {
    /**
     * Description
     * @method request
     * @param {} object
     * @return object
     */
    request: function(object) {
      if(localStorage.getItem('token')) {
        object.headers['access_token'] = localStorage.getItem('token');
      }
      return object;
    }
  };
  return attach;
});
