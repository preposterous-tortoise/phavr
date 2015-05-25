// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('drakeApp', ['ionic', 'drakeApp.home', 'drakeApp.nav', 'drakeApp.favor',
                              'drakeApp.login', 'drakeApp.requestMap', 'drakeApp.favorDetails',
                              'drakeapp.photoFactory', 'drakeApp.favorfact', 'drakeapp.locationFactory',
                              'uiGmapgoogle-maps'])
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
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/')
  
  //home template
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'homeCtrl'
  })

  $stateProvider.state('requestmap', {
    url: '/requestmap',
    templateUrl: './views/requestMap.html',
    controller: 'requestMapCtrl'
  })

  $stateProvider.state('login', {
    url: '/login',
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

  
})
