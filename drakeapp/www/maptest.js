angular.module('ionic.example', ['ionic'])

    .controller('MapCtrl', function($scope, $ionicLoading, $compile, $http) {
      var markerMap = {};

      function getFavorForMarker(marker) {
        var value;
        for (var key in markerMap) {
          value = markerMap[key];
          if (value.marker === marker) {
            return value.favor;
          }
        }
      }
      
      function addMarker(favor, map) {
        var coords = favor.loc.coordinates;
        var location = {lat: coords[1], lng: coords[0]};
        var marker = new google.maps.Marker({
            position: location,
            map: map
          });
        marker.setIcon(/** @type {google.maps.Icon} */({
          url: favor.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(location);
        marker.setVisible(true);
        google.maps.event.addListener(marker, "click", function() {
          var favor = getFavorForMarker(this);
          alert('marker clicked: ' + favor.description);
        });
        markerMap[favor._id] = { marker: marker, favor: favor };
      }

      function initialize() {
        var myLatlng = new google.maps.LatLng(37.786718, -122.41114199999998);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        google.maps.event.addListener(map, "bounds_changed", function() {
           var favors = $scope.fetchRequests(map.getBounds(), function (favors) {
             if (favors) {
              for (var i = 0; i < favors.length; i++) {
                if (!(markerMap[favors[i]._id]))
                  addMarker(favors[i], map);
              }
             }
           });
        });

        var input = (document.getElementById('pac-input'));
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);

          var infowindow = new google.maps.InfoWindow();
          var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
          });

          google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
              window.alert("Autocomplete's returned place contains no geometry");
              return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setIcon(/** @type {google.maps.Icon} */({
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }
            $scope.saveRequest(place.name, place.geometry.location, place.icon);

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
          });



        $scope.map = map;
        // $scope.centerOnMe();
      }
      $scope.saveRequest = function (description, location, icon) {
        $http({
                method: 'POST',
                url: '/api/requests/create',
                data: {
                    description: description,
                    location: location, 
                    icon: icon
                }
            })
            .then(function(resp) {
              console.log(resp);
                return resp;
            });
      }
      $scope.fetchRequests = function(bounds, callback) {
        console.log("SW: ", bounds.getSouthWest().lng(), bounds.getSouthWest().lat());
        console.log("NE: ", bounds.getNorthEast().lng(), bounds.getNorthEast().lat());
        var box = [ [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
          [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]];
        return $http({
                method: 'POST',
                url: '/api/requests/',
                data: {
                    box: box
                }
            })
            .success(function(favors, status, headers, config) {
              console.log(favors);
              if (callback) callback(favors)
              return favors;
            })
            .error(function(data, status, headers, config) {
              console.log('fetch Requests error: ', data, status, headers, config);
              return null;
            });
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
    });