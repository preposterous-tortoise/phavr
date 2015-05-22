angular.module('ionic.example', ['ionic'])

    .controller('MapCtrl', function($scope, $ionicLoading, $compile, $http) {
      function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        google.maps.event.addListener(map, "bounds_changed", function() {
           // send the new bounds back to your server
           console.log("map bounds{"+map.getBounds());
           $scope.fetchRequests(map.getBounds());
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

        
        /*//Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });*/

/*        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });
*/
        $scope.map = map;
        $scope.centerOnMe();
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
      $scope.fetchRequests = function(bounds) {
        console.log("SW: ", bounds.getSouthWest().lng(), bounds.getSouthWest().lat());
        console.log("NE: ", bounds.getNorthEast().lng(), bounds.getNorthEast().lat());
        var box = [ [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
          [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]];
        $http({
                method: 'POST',
                url: '/api/requests/',
                data: {
                    box: box
                }
            })
            .success(function(resp, status, headers, config) {
              console.log(resp);
                return resp;
            })
            .error(function(data, status, headers, config) {
              console.log('fetch Requests error: ', data, status, headers, config);
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