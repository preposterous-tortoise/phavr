angular.module('phavr.mapService', [])
  .factory('mapService', function($window, $location, Favors, $cordovaGeolocation) {

    var myLatlng = new google.maps.LatLng(37.783724, -122.40897799999999);

    var genericIconURL = "http://frit-talk.com/mobile/2/endirect.png";
    var farIconURL = "http://simpleicon.com/wp-content/uploads/map-marker-1.png";

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    /**
     * Description
     * @method calculateDistance
     * @param {} lat1
     * @param {} lon1
     * @param {} lat2
     * @param {} lon2
     * @param {} callback
     * @return BinaryExpression
     */
    var calculateDistance = function(lat1, lon1, lat2, lon2, callback){

      /**
       * Description
       * @method deg2rad
       * @param {} deg
       * @return BinaryExpression
       */
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      
      console.log('calculated distance!!', d*0.621371);
      return d *0.621371; //distance in miles
    };

    /**
     * Description
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

    /**
     * Description
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
     * Description
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
      
      /**
       * Description
       * @method getLocation
       * @return myLatlng
       */
      getLocation: function() {
        return myLatlng;
      },

      /**
       * Description
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
       * Description
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
       * Description
       * @method addMarker
       * @param {} favor
       * @param {} map
       * @param {} markerMap
       * @param {} addInfoWindow
       * @return 
       */
      addMarker: function(favor, map, markerMap, addInfoWindow) {
        //get favor's location
        var location = getFavorLocation(favor);
        var isClose = true;

        if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
          //only change markers if we're on the phone
          console.log('getting location to place correct marker...');

          //get user's location
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function(spot) {//calculate distance
              var lat1 = spot.coords.latitude;
              var lon1 = spot.coords.longitude;
              var lat2 = location.lat;
              var lon2 = location.lng;

              console.log(lat1, lon1, lat2, lon2);

              console.log('calculating distance...');
              var dist = calculateDistance(lat1, lon1, lat2, lon2);

              if(dist > 2) { //if the favor is more than two miles away from the user
                //set the icon
                console.log('that favor is too far away!');
                isClose = false;
              }
              
              var infowindow = new google.maps.InfoWindow();
              var marker = new google.maps.Marker({
                position: location,
                map: map
              });

              //set icon based on distance
              if(isClose) {
                console.log('using close icon');
                marker.setIcon( /** @type {google.maps.Icon} */ ({
                  url: genericIconURL, //favor.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(35, 35)
                }));
              } else {
                console.log('using far icon');
                marker.setIcon( /** @type {google.maps.Icon} */ ({
                  url: farIconURL, //favor.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(35, 35)
                }));
              }

              marker.setPosition(location);
              marker.setVisible(true);
              var description = favor.description || "";
              if (addInfoWindow) {
                infowindow.setContent('<div>' + description + '</div><div><strong>' + favor.place_name + '</strong><br>');
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
            });
        } else {

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });

        //set icon based on distance
        if(isClose) {
          console.log('using close icon');
          marker.setIcon( /** @type {google.maps.Icon} */ ({
            url: genericIconURL, //favor.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          }));
        } else {
            console.log('using far icon');
            marker.setIcon( /** @type {google.maps.Icon} */ ({
              url: farIconURL, //favor.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(35, 35)
            }));
        }

        marker.setPosition(location);
        marker.setVisible(true);
        var description = favor.description || "";
        if (addInfoWindow) {
          infowindow.setContent('<div>' + description + '</div><div><strong>' + favor.place_name + '</strong><br>');
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
      }
      },

      /**
       * Description
       * @method createMap
       * @return NewExpression
       */
      createMap: function() {
        return new google.maps.Map(document.getElementById("map"), mapOptions);
      },

      /**
       * Description
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

          Favors.fetchRequests(box, function(favors) {
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
       * Description
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
        }
      }
    }
  });
