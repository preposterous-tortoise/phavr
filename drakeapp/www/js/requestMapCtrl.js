angular.module('drakeApp.requestMap', [])
  .controller('requestMapCtrl', function($scope, $location, $http) {

    var markerMap = {};
    var initialized = false;

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
      var location = {
        lat: coords[1],
        lng: coords[0]
      };
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
      infowindow.setContent('<div><strong>' + favor.description + '</strong><br>');
      infowindow.open(map, marker);
      google.maps.event.addListener(marker, "click", function() {
        var favor = getFavorForMarker(this);
        alert('marker clicked: ' + favor.description);
      });
      markerMap[favor._id] = {
        marker: marker,
        favor: favor
      };
    }

    function initialize() {
    	if (initialized) {
    		return;
    	} else {
    		initialized = true;
    	}
      var myLatlng = new google.maps.LatLng(37.786718, -122.41114199999998);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListener(map, "bounds_changed", function() {
        var favors = $scope.fetchRequests(map.getBounds(), function(favors) {
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

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        $scope.saveRequest(place.name, place.geometry.location, place.icon);
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Why 17? Because it looks good.
        }
      });

      $scope.map = map;
    }
    $scope.saveRequest = function(description, location, icon) {
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
          console.log('fetch Requests error: ', data, status, headers, config);
          return null;
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);

  });