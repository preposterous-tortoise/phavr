angular.module('drakeApp.requestMap', ['ionic', 'uiGmapgoogle-maps'])
  .controller('requestMapCtrl', function($scope, $timeout, $location, uiGmapGoogleMapApi, Favors, mapService) {

    // Define variables for our Map object
    var areaLat = 37.786718,
      areaLng = -122.41114199999998,
      areaZoom = 16;

    var getBoxForBounds = function(bounds) {
      return [
        [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]
      ];
    };

    var getFavorLocation = function(favor) {
      if (favor.loc) {
        var coords = favor.loc.coordinates;
        return {
          lat: coords[1],
          lng: coords[0]
        };
      } else {
        return favor.location;
      }
    };

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
            // console.log(' NEW BOUNDS: ', getBoxForBounds(map.getBounds()));
          }
        }
      };

      $timeout(function() {
        var map = $scope.map.control.getGMap();
        if (map) {
          var markerMap = {};
          //mapService.addBoundsListener(map, markerMap);
        }
      });

      $scope.options = {
        scrollwheel: false
      };

      // $scope.$watch("map.bounds", function(newValue, oldValue) {
      //   console.log('bounds changed on watch: ', newValue, oldValue);
      // }, true);
      var bounds = new google.maps.LatLngBounds(); //$scope.map.getBounds();
      var box = getBoxForBounds(bounds);
      box = [
        [-123, 37],
        [-122, 38]
      ];
      $scope.map.markers = [];
      Favors.fetchRequests(box, function(favors) {
        if (favors) {
          for (var i = 0; i < favors.length; i++) {
            var favor = favors[i];
            // if (!(markerMap[favors[i]._id]))
            //   context.addMarker(favors[i], map, markerMap);
            var location = getFavorLocation(favor);
            var marker = {
              id: i,
              latitude: location.lat,
              longitude: location.lng,
              // icon: favor.icon,
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
            $scope.map.markers.push(marker);
          }
        }
      });





    });



  });