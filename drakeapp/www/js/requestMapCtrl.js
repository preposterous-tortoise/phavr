angular.module('drakeApp.requestMap', ['ionic', 'uiGmapgoogle-maps'])
  .controller('requestMapCtrl', function($scope, $timeout, $location, uiGmapGoogleMapApi, Favors, mapService, Nav) {

    var areaZoom = 16;
    var markerMap = {};

    var updateMarkers = function(bounds) {
      var box = mapService.getBoxForBounds(bounds);
      Favors.fetchRequests(box, function(favors) {
        if (favors) {
          // console.log('favors retrieved: ', favors.length);
          for (var i = 0; i < favors.length; i++) {
            var favor = favors[i];
            if (markerMap[favors[i]._id]) continue;
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
            marker.onClick = function(marker, event) {
              console.log('marker clicked: ', marker.model.favor.description);
              Favors.setFavor(marker.model.favor);
              $location.path('/favordetails');
            };
            markerMap[favors[i]._id] = marker;
            $scope.map.markers.push(marker);
          }
        }
      });
    }

    /*  ANGULAR GOOGLE MAPS INITIALIZATION */
    uiGmapGoogleMapApi.then(function(maps) {
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
          mapService.addBoundsListener(map, markerMap);
          mapService.addPlaceChangedListener(map, true);
        }
      });

      $scope.options = {
        scrollwheel: false
      };

      $scope.map.markers = [];
    });



  });
