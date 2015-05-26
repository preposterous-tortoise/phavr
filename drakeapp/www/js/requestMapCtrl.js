angular.module('drakeApp.requestMap', ['ionic', 'uiGmapgoogle-maps'])
  .controller('requestMapCtrl', function($scope, $location, $http, uiGmapGoogleMapApi, Favors, mapService) {

    var markerMap = {};
    var initialized = false;

    // Define variables for our Map object
    var areaLat      = 37.786718,
        areaLng      = -122.41114199999998,
        areaZoom     = 16;

    /*  ANGULAR GOOGLE MAPS INITIALIZATION */
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom };
      $scope.options = { scrollwheel: false };
    });

    function getFavorForMarker(marker, markerMap) {
      var value;
      for (var key in markerMap) {
        value = markerMap[key];
        if (value.marker === marker) {
          return value.favor;
        }
      }
    }

    function getFavorLocation(favor) {
      if (favor.loc) {
        var coords = favor.loc.coordinates;
        return {
          lat: coords[1],
          lng: coords[0]
        };
      } else {
        return favor.location;
      }
    }

    function addMarker(favor, map, markerMap) {
      var location = getFavorLocation(favor);
      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
      marker.setIcon( /** @type {google.maps.Icon} */ ({
        url: favor.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(location);
      marker.setVisible(true);
      var description = favor.description || "";
      infowindow.setContent('<div>' + description + '</div><div><strong>' + favor.place_name + '</strong><br>');
      infowindow.open(map, marker);
      if (favor._id) {
        google.maps.event.addListener(marker, "click", function() {
          var favor = getFavorForMarker(this, markerMap);
          alert('marker clicked: ' + favor.description);
        });
        markerMap[favor._id] = {
          marker: marker,
          favor: favor
        };
      }
      return marker;
    }

    function getBoxForBounds(bounds) {
      return [
        [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]
      ];
    }

    function init() {
      map = mapService.createMap();
      mapService.addBoundsListener(map, markerMap);
      mapService.addPlaceChangedListener(map);
    }

    function initialize() {
    	// if (initialized) {
    	// 	return;
    	// } else {
    	// 	initialized = true;
    	// }
      var myLatlng = new google.maps.LatLng(37.786718, -122.41114199999998);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      if (!document.getElementById("map")) return; // using angular google maps
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListener(map, "bounds_changed", function() {
        var box = getBoxForBounds(map.getBounds());
        if (box[0][0] === box[1][0]) {
          console.log('EMPTY BOUNDS from google maps.');
          return;
        }
        Favors.fetchRequests(box, function(favors) {
          if (favors) {
            for (var i = 0; i < favors.length; i++) {
              if (!(markerMap[favors[i]._id]))
                addMarker(favors[i], map, markerMap);
            }
          }
        });
      });

      var input = (document.getElementById('pac-input'));
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      if (input) {
	      var autocomplete = new google.maps.places.Autocomplete(input);
	      autocomplete.bindTo('bounds', map);

	      google.maps.event.addListener(autocomplete, 'place_changed', function() {
	        var place = autocomplete.getPlace();
	        if (!place.geometry) {
	          return;
	        }
          var favor = {
            place_name: place.name,
            address: place.formatted_address,
            location: place.geometry.location,
            icon: place.icon
          }
	        //Favors.saveRequest(favor);
          $scope.favor = favor;
          mapService.favor = favor;
          if ($scope.marker) {
            $scope.marker.setMap(null);
          }
          $scope.marker = addMarker(favor, map);
	        // If the place has a geometry, then present it on a map.
	        if (place.geometry.viewport) {
	          map.fitBounds(place.geometry.viewport);
	        } else {
	          map.setCenter(place.geometry.location);
	          map.setZoom(17); // Why 17? Because it looks good.
	        }
	      });
      }

      $scope.map = map;
    }
    /*$scope.saveRequest = function(favor) {
      $http({
        method: 'POST',
        url: '/api/requests/create',
        data: favor
      })
      .success(function(data, status, headers, config) {
        return data;
      })
      .error(function(data, status, headers, config) {
        console.log('saveRequest error, ', data, status, headers, config);
      });
    }
    $scope.fetchRequests = function(bounds, callback) {
      var box = [
        [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]
      ];
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
          console.log('fetchRequests error: ', data, status, headers, config);
          return null;
        });
    }*/
    //initialize();
    // init();
    //google.maps.event.addDomListener(window, 'load', initialize);

  });