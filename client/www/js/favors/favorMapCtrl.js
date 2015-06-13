/*
 * Favor Map Controller
 *
 * Corresponds to favorMap.html. Initializes a google map to display all favors near user
 * also has a search bar to change location
 *
 */

angular.module('phavr.favorMap', ['ionic', 'uiGmapgoogle-maps'])
.controller('FavorMapCtrl', function($scope, $timeout, uiGmapGoogleMapApi, mapService) {

  var areaZoom = 16;
  var markerMap = {};

  //location search:
  $scope.search = false;
  
  /**
    * toggle the search bar
    * @method toggleSearch
    */
  
  $scope.toggleSearch = function() {
    $scope.search = !$scope.search;
  };

  //initialize map:
  uiGmapGoogleMapApi.then(function(maps) {
    //console.log('initializing the request map...');
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
          //updateMarkers(map.getBounds());
        }
      }
    };
      
    markerMap = {};

    $timeout(function() {
      var map = $scope.map.control.getGMap();
      if (map) {
        mapService.addBoundsListener(map, markerMap);
        mapService.addPlaceChangedListener(map, 'requestMap');
      }
    });

    $scope.options = {
      scrollwheel: false
    };

    $scope.map.markers = [];
  });
});

