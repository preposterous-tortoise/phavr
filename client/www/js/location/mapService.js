angular.module('phavr.mapService', [])
  .factory('mapService', function($window, $location, Favors) {

    var myLatlng = (window.google) ? new google.maps.LatLng(37.783724, -122.40897799999999) : null;

    //Icon for the location of a favor
    var genericIconURL = "http://frit-talk.com/mobile/2/endirect.png";
    
    //Icon for the location of a favor that is outside the user's allowed area to take photos
    var farIconURL = "http://simpleicon.com/wp-content/uploads/map-marker-1.png";

    //Options for the Google Map API
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: (window.google) ? google.maps.MapTypeId.ROADMAP: null
    };

    /**
     * This function calculates the distance between two geo-coordinates in miles
     * @method calculateDistance
     * @param {} lat1
     * @param {} lon1
     * @param {} lat2
     * @param {} lon2
     * @return BinaryExpression
     */
    var calculateDistance = function(lat1, lon1, lat2, lon2){

      /*
       * Inner function that converts degrees to radians
       * @method deg2rad
       * @param {} deg
       * @return BinaryExpression
       */
      function deg2rad(deg) {
        return deg * (Math.PI/180);
      }
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      
      console.log('calculated distance!!', d*0.621371);
      return d *0.621371; //distance in miles
    };

    /*
     * Get's the box(bounds) for finding favors within the passed location
     * @method getBoxForBounds
     * @param {} bounds
     * @return ArrayExpression
     */
    var getBoxForBounds = function(bounds) {
      return [
        [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]
      ];
    };

    /*
     * Get the favor corresponding to the marker
     * @method getFavorForMarker
     * @param {} marker
     * @param {} markerMap
     * @return 
     */
    var getFavorForMarker = function(marker, markerMap) {
      var value;
      for (var key in markerMap) {
        value = markerMap[key];
        if (value.marker === marker) {
          return value.favor;
        }
      }
    };

    /**
     * Get the location date from the favor
     * @method getFavorLocation
     * @param {} favor
     * @return 
     */
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
      getBoxForBounds: getBoxForBounds,

      mapBounds: null, //these mapBounds are shared b/w the request map and home feed

      getFavorLocation: getFavorLocation,
      
      /*
       * Returns your location
       * @method getLocation
       * @return myLatlng
       */
      getLocation: function() {
        return myLatlng;
      },

      /**
       * Sets the location of the map
       * @method setLocation
       * @param {} lat
       * @param {} lng
       * @return 
       */
      setLocation: function(lat, lng) {
        myLatlng = new google.maps.LatLng(lat, lng);
        mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      },

      /**
       * Add's a default marker to the map of where you are
       * @method addDefaultMarker
       * @param {} map
       * @return 
       */
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
        this.marker = this.addMarker(favor, map, null, true);
      },

      /**
       * This function adds a marker to the map
       * @method addMarker
       * @param {Object} favor
       * @param {Object} map
       * @param {Object} markerMap
       * @param {Boolean} addInfoWindow
       * @return 
       */
      addMarker: function(favor, map, markerMap, addInfoWindow) {
        //get favor's location
        var location = getFavorLocation(favor);
        var isClose = true;
        var lat1 = myLatlng.lat();
        var lon1 = myLatlng.lng();
        var lat2 = location.lat;
        var lon2 = location.lng;
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });

        console.log(lat1, lon1, lat2, lon2);
        console.log('calculating distance...');
        var dist = calculateDistance(lat1, lon1, lat2, lon2);
        if(dist > 2) { //if the favor is more than two miles away from the user
          //set the icon
          console.log('that favor is too far away!');
          isClose = false;
        }
        //show camera icon if favor distance is less than 5 miles
        if(dist < 5) {
          favor.camera = dist < 5;
        }

        //set icon based on distance
        if(isClose) {
          console.log('using close icon');
          marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: genericIconURL, //favor.icon,
            size: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16),
            scaledSize: new google.maps.Size(32, 32)
          }));
        } else {
            console.log('using far icon');
            marker.setIcon( /** @type {google.maps.Icon} */ ({
              url: farIconURL, //favor.icon,
              size: new google.maps.Size(32, 32),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(16, 32),
              scaledSize: new google.maps.Size(32, 32)
            }));
        }

        marker.setPosition(location);
        marker.setVisible(true);
        var description = favor.description || "";
        if (addInfoWindow) {
          var infowindow = new google.maps.InfoWindow();
          infowindow.setContent('<div>' + description + '</div><div><strong>' + 
                                favor.place_name + '</strong><br>');
          infowindow.open(map, marker);
        }
        if (favor._id) {
          google.maps.event.addListener(marker, "click", function() {
            var favor = getFavorForMarker(this, markerMap);
            if (favor._id) {
              Favors.setFavor(favor);
              $window.location.assign('#/favordetails');
            }
          });
          markerMap[favor._id] = {
            marker: marker,
            favor: favor
          };
        }
        return marker;
      },

      /**
       * Adds a Google Map to the DOM
       * @method createMap
       * @return NewExpression
       */
      createMap: function() {
        return new google.maps.Map(document.getElementById("map"), mapOptions);
      },

      /**
       * This function adds markers and removes markers accordingly as the user moves and zoom in/outs the map
       * @method addBoundsListener
       * @param {} map
       * @param {} markerMap
       * @return 
       */
      addBoundsListener: function(map, markerMap) {
      	var context = this;
        google.maps.event.addListener(map, "bounds_changed", function() {
          var box = getBoxForBounds(map.getBounds());

          if (box[0][0] === box[1][0]) {
            console.log('EMPTY BOUNDS from google maps.');
            return;
          }

          Favors.fetchFavors(box, function(favors) {
            if (favors) {
              for (var i = 0; i < favors.length; i++) {
                if (!(markerMap[favors[i]._id]))
                  context.addMarker(favors[i], map, markerMap);
              }
            }
          });
          context.mapBounds = box;
          console.log('mapBounds set!');
          console.log(context.mapBounds);
        });
      },

      /**
       * Function thats listens to a place change and updates the map and feed
       * @method addPlaceChangedListener
       * @param {} map
       * @param {} mapName
       * @return 
       */
      addPlaceChangedListener: function(map, mapName) {
      	var context = this;
        var input = (document.getElementById('pac-input'));
        if(mapName === 'requestMap') {
          input = (document.getElementById('req-input'));
          //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        }
        if(mapName === 'feedMap') {
          console.log('feedMAP');
          input = (document.getElementById('feed-input'));
        }

        if (input) {
          var autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);

          google.maps.event.addListener(autocomplete, 'place_changed', function() {
            console.log('place changed!');
            var place = autocomplete.getPlace();
            console.log(place);
            
            //set bounds based on place location
            console.log(place.geometry.location);
            var radius = 0.289855;
            var box = [[place.geometry.location.F-radius, place.geometry.location.A-radius], [place.geometry.location.F+radius, place.geometry.location.A+radius]];
            context.mapBounds = box;
            console.log('mapBounds set!');
            console.log(context.mapBounds);

            if (!place.geometry) {
              return;
            }
            var favor = {
                place_name: place.name,
                address: place.formatted_address,
                location: place.geometry.location,
                icon: genericIconURL //place.icon
              }
            context.favor = favor;
            if (context.marker) {
              context.marker.setMap(null);
            }
            if(mapName !== 'requestMap') {
              context.marker = context.addMarker(favor, map);
            }
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17); // Why 17? Because it looks good.
            }
            return false;
          });

          google.maps.event.addDomListener(input, 'keydown', function(e) {
            if (e.keyCode == 13) { e.preventDefault(); }
          });
        }
      }
    }
  });
