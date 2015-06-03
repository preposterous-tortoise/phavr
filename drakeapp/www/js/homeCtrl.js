angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $rootScope, $location, $http, Favors, photoFactory, geo, Nav, mapService, uiGmapGoogleMapApi, $timeout){
 

  $rootScope.login = true;

  $scope.mapBounds = mapService.mapBounds;

  $scope.favors = [];

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(favor) {
    console.log("THIS IS FAVOR "+JSON.stringify(favor));
    Favors.upVote(favor, 1);
  }; 

  $scope.downVote = function(favor) {
    Favors.downVote(favor, -1);
  };


  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }

  $scope.updateFavors = function(){
    console.log('attempting to update favors...');
    //geo.getLocation(function(spot){
    console.log('map bounds', mapService.mapBounds);
    if(mapService.mapBounds === null) {
      console.log('mapBounds was null, getting user location...');
      geo.phoneLocation(function(spot) {
        console.log('getting location');

        var radius = 0.289855;
        var box = [[spot.coords.longitude-radius, spot.coords.latitude-radius], [spot.coords.longitude+radius, spot.coords.latitude+radius]];

        console.log(box);

        Favors.fetchRequests(box, function(data){
          console.log('got requests', data);
          $scope.favors = data;
          console.log($scope.favors);
        });
      });
    } else { 
        console.log('mapBounds was defined! Getting requests in those map bounds...');
        Favors.fetchRequests(mapService.mapBounds, function(data){
          console.log('got requests', data);
          $scope.favors = data;
          console.log($scope.favors);
        });
    }
        
  };

  $scope.enableTracking = function(){
    geo.enableTracking();
  };

  $scope.filter = '-createdAt';

  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  $scope.new = function() {
    $scope.filter = '-createdAt';
  };

  $scope.getPic = function() {
    console.log("YO GET PIC IS HAPPENING!")
    Favors.getUserInfo();
  }

  $scope.getPic();

  $scope.testVar = true;
  $scope.updateFavors();

  $scope.toggle = false;
  $scope.setToggle = function() {
    $scope.toggle = !$scope.toggle;
  }

  var areaZoom = 16;
  var markerMap = {};

  uiGmapGoogleMapApi.then(function(maps) {
      console.log('initializing the feed map...');
      var location = mapService.getLocation();
      $scope.map = {
        center: {
          latitude: location.lat(),
          longitude: location.lng()
        },
        zoom: areaZoom,
        control: {
          getGMap: function() {}
        },
        events: {
          bounds_changed: function(map, eventName) {
            // console.log(' NEW BOUNDS: ', JSON.stringify(mapService.getBoxForBounds(map.getBounds())));
            //updateMarkers(map.getBounds());
          }
        }
      };
      markerMap = {};

      $timeout(function() {
        var map = $scope.map.control.getGMap();
        if (map) {
          //mapService.addBoundsListener(map, markerMap);
          mapService.addPlaceChangedListener(map, 'feedMap');
        }
      });

      $scope.options = {
        scrollwheel: false
      };

      $scope.map.markers = [];
    });


});

