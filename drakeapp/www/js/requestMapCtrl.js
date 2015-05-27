angular.module('drakeApp.requestMap', ['ionic', 'uiGmapgoogle-maps'])
  .controller('requestMapCtrl', function($scope, $timeout, $http, uiGmapGoogleMapApi, Favors, mapService) {

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

    $scope.onClick = function(a, b, c) {
      console.log('in scope marker clicked: ', a, b, c);
    }

    angular.forEach($scope.markers,function(marker){

        /*marker.closeClick = function() {
          marker.showWindow = false;
          $scope.$apply();
        };*/

        marker.onClick = function(a, b, c){
          console.log('!in scope marker clicked: ', a, b, c);
          alert(marker.id);
          // onMarkerClicked(marker.id);
        };

 });

    /*  ANGULAR GOOGLE MAPS INITIALIZATION */
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = {
        center: {
          latitude: areaLat,
          longitude: areaLng
        },
        zoom: areaZoom,
        events: {
          bounds_changed: function(map, eventName) {
            //console.log('bounds changed: ', a, b, c);
            console.log(' NEW BOUNDS: ', getBoxForBounds(map.getBounds()));
          },
          idle: function(map, eventName, originalEventArgs) {
            console.log('idle: ', map, eventName, originalEventArgs);
          }
        }
      };

      $timeout(function() {
        console.log('TIMEOUT FIRED');
        //var map = $scope.map.control.getGMap();
        //console.log('actual map: ', map);
        // var maps = google.maps;
      });

      $scope.$watch("map.bounds", function(newValue, oldValue) {
        console.log('bounds changed on watch: ', newValue, oldValue);
      }, true);
      $scope.options = {
        scrollwheel: false
      };

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
              // alert(marker.id);
              // onMarkerClicked(marker.id);
            };
            $scope.map.markers.push(marker);
          }
        }
      });




    });



  });