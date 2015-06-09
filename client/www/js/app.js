// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('phavr', ['ionic', 'ngCordova', 'phavr.login', 'phavr.home', 'phavr.profile', 'phavr.nav', 
                              'phavr.favor', 'phavr.favorMap', 'phavr.favorDetails',
                              'phavr.photoFactory', 'phavr.favorfact', 'phavr.locationFactory',
                              'uiGmapgoogle-maps','phavr.mapService', 'phavr.favorCreationMap', 
                              'phavr.authFactory', 'phavr.nav',
                              'phavr.pushfact', 'phavr.notification'])
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
  
  //home template
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'views/home.html',
    controller: 'homeCtrl'
  })

  $stateProvider.state('favormap', {
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
    url: '/favor',
    templateUrl: './views/favor.html',
    controller: 'favorCtrl'
  })

  $stateProvider.state('favordetails', {
    url: '/favordetails',
    templateUrl: './views/favorDetails.html',
    controller: 'favorDetailsCtrl'
  })

  $stateProvider.state('profile', {
    url: '/profile',
    templateUrl: 'views/profile.html',
    controller: 'profileCtrl'
  })

  $stateProvider.state('notifications', {
    url: '/notifications',
    templateUrl: 'views/notification.html',
    controller: 'notificationCtrl'
  })


  //we add our $httpIntereceptor into the array of interceptors.
  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window){
  //middlewear to insert token for all outgoing requests
  var attach = {
    request: function(object) {
      if(localStorage.getItem('token')) {
        object.headers['access_token'] = localStorage.getItem('token');
      }
      return object;
    }
  };
  return attach;
});
