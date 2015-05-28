angular.module('drakeApp.mapService', [])
  .factory('mapService', function($location, Favors) {

    var myLatlng = new google.maps.LatLng(37.783724, -122.40897799999999);

    var genericIconURL = "http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png"

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var getBoxForBounds = function(bounds) {
      return [
        [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]
      ];
    };

    var getFavorForMarker = function(marker, markerMap) {
      var value;
      for (var key in markerMap) {
        value = markerMap[key];
        if (value.marker === marker) {
          return value.favor;
        }
      }
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

    return {
      getLocation: function() {
        return myLatlng;
      },
      setLocation: function(lat, lng) {
        myLatlng = new google.maps.LatLng(lat, lng);
        mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      },
      addDefaultMarker: function(map) {
        var favor = {
            place_name: 'You are here',
            address: '',
            location: myLatlng,
            icon: genericIconURL
          }
        this.favor = favor;
        if (this.marker) {
          this.marker.setMap(null);
        }
        this.marker = this.addMarker(favor, map);
      },
      addMarker: function(favor, map, markerMap) {
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
            Favors.setFavor(favor);
            $location.path('/favordetails');
          });
          markerMap[favor._id] = {
            marker: marker,
            favor: favor
          };
        }
        return marker;
      },
      createMap: function() {
        return new google.maps.Map(document.getElementById("map"), mapOptions);
      },
      addBoundsListener: function(map, markerMap) {
      	var context = this;
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
                  context.addMarker(favors[i], map, markerMap);
              }
            }
          });
        });
      },
      addPlaceChangedListener: function(map) {
      	var context = this;
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
            context.favor = favor;
            if (context.marker) {
              context.marker.setMap(null);
            }
            context.marker = context.addMarker(favor, map);
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17); // Why 17? Because it looks good.
            }
            return false;
          });
        }
      }
    }
  });