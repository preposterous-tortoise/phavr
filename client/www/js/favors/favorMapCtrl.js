/*
 * Favor Map Controller
 *
 * Corresponds to favorMap.html. Initializes a google map to display all favors near user
 * also has a search bar to change location
 *
 */

angular.module('phavr.favorMap', ['ionic', 'uiGmapgoogle-maps'])
.controller('FavorMapCtrl', function($scope, $timeout, $location, uiGmapGoogleMapApi, Favors,geo, mapService) {

  var areaZoom = 16;
  var markerMap = {};

  /**
    * get nearby and place them on the map
    * @method updateMarkers
    * @param {} bounds
    * @return 
    */

  var updateMarkers = function(bounds) {
    var box = mapService.getBoxForBounds(bounds);

    //get favors from server
    Favors.fetchFavors(box, function(favors) {
      if(favors) {
        // console.log('favors retrieved: ', favors.length);
        
        for(var i = 0; i < favors.length; i++) {
          var favor = favors[i];
          
          if(markerMap[favors[i]._id]) continue;

          var location = mapService.getFavorLocation(favor);
          var marker = {
            id: i,
            latitude: location.lat,
            longitude: location.lng,
            icon: {
              url: favor.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(35, 35)
            },
            options: {},
            favor: favor,
            fit: true
          };
          
          //callback for a map click action
          marker.onClick = function(marker, event) {
            //console.log('marker clicked: ', marker.model.favor.description);
            Favors.setFavor(marker.model.favor);
            $location.path('/favordetails');
          };
            
          markerMap[favors[i]._id] = marker;
          $scope.map.markers.push(marker);
        }
      }
    });
  };

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

