/*
 * Home Controller
 *
 * Corresponds to home.html, the main view of the app.
 * Displays favors from a location (the user's geolocation by default),
 * and filters them by popularity or recency.
 * 
 * Includes functionality for upvoting and downvoting favors.
 *
 */

angular.module('phavr.home', [])
.controller('homeCtrl', function($scope, $rootScope, $location, $http, $timeout, Favors, Photos, geo, mapService, uiGmapGoogleMapApi) {

  //allows header bar to be shown
  $rootScope.login = true;

  //the favors being displayed in this view
  $scope.favors = [];
  
  //hard-coded example favors, for testing purposes:

  /*[{_id: 1, 
    topic: 'Street Fashion', 
    description: 'What are people on Filmore St wearing?', 
    topPhoto: 'https://farm4.staticflickr.com/3875/14660511001_9f7cf7150a_b.jpg', 
    votes: 2, 
    distance: 0.256, 
    camera: true}, 
   {_id: 1, 
     topic: 'meowmeowmeow', 
     description: 'mirror mirror on the wall, who is the longest cat of all', 
     topPhoto: 'http://www.autofish.net/mirrors/images/animals/cats/long_cat.jpg', 
     votes: 2, 
     distance: 0.256, 
     camera: true}];*/

  $scope.selectedFavor = Favors.selectedFavor;
  
  $scope.noFavors = false; //determines whether a 'no favors available' message is displayed

  /**
   * Retrieves favors within the current map bounds from the server
   * @method updateFavors
   */

  $scope.updateFavors = function() {
    //console.log('updating favors...');
    if(mapService.mapBounds === null) {

      //get the user's location and set the map bounds
      geo.phoneLocation(function(spot) {

        //1 mile to 1.60934 km
        //1 latitude to 69.047 miles
        //1 mile to 0.02899 latitude
        
        var miles = 10;
        var radius = 0.02899*miles;
        var box = [[spot.coords.longitude-radius, spot.coords.latitude-radius], 
                  [spot.coords.longitude+radius, spot.coords.latitude+radius]];

        window.localStorage.setItem('longitude', spot.coords.longitude.toString());
        window.localStorage.setItem('latitude', spot.coords.latitude.toString());

        //fetch favors from server 
        Favors.fetchFavors(box, function(data) {
          //for each favor attach distance to current location
          data.forEach(function(favor) {
            favor.distance = $scope.getDistance(favor.loc);

            //show camera icon if favor distance is less than 5 miles
            favor.camera = favor.distance < 5;
          });
          
          $scope.favors = data;

          //if there are no favors available, display a message indicating this
          if ($scope.favors.length !== 0) {
            $scope.noFavors = false;
          } else { 
            $scope.noFavors = true;
          }

          //get the top photos for these favors
          $scope.getTopPhotos();

        });
      });
    } else { 
        Favors.fetchFavors(mapService.mapBounds, function(data) {
          $scope.favors = data;

          if ($scope.favors.length !== 0) {
            $scope.noFavors = false;
          } else { 
            $scope.noFavors = true;
          }
          //for each favor attach distance to current location
          $scope.favors.forEach(function(favor) {
            favor.distance = $scope.getDistance(favor.loc);
            //show camera icon if favor distance is less than 5 miles
            favor.camera = favor.distance < 5;
          });
          
          //get top photos for favors
          $scope.getTopPhotos();
        });
    }
  };

  /**
   * Upon clicking a favor, user will be redirected to favor details page
   * @method favorDetails
   * @param {} favor
   */

  $scope.favorDetails = function(favor) {
    Favors.setFavor(favor);
    $location.path('/favordetails');
  }

  /**
   * Get the photos for each favor and determine the photo with the highest votes.
   * display this photo on the home feed.
   * @method getTopPhotos
   * @param {} requests
   */

  $scope.getTopPhotos = function(requests) {
    //for each fetched request, display the top photo
    for(var i = 0; i < $scope.favors.length; i++) {
      var currentFavor = $scope.favors[i];

      //create a closure for $scope.favors[i]
      (function(currentFavor) {
        Photos.getPhotosForFavor(currentFavor, function(photos) {
          //find the photo with the most votes
          var topVotes = Number.NEGATIVE_INFINITY;
          var topPhoto = null;
          for(var j = 0; j < photos.length; j++) {
            if(photos[j].votes > topVotes) {
              topVotes = photos[j].votes;
              topPhoto = photos[j];
            }
          }
          if(topPhoto) {
            currentFavor.topPhoto = topPhoto.url;
          }
        });
      })($scope.favors[i]);
    }
    //stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };


  //favor sorting: 
  $scope.filter = '-createdAt'; //by default, show most recent
  $scope.popular = false;

  /**
   * Display the most popular favors
   * @method hot
   */

  $scope.hot = function(){
    $scope.popular = true;
    $scope.filter = '-votes';
  };

  /**
   * Display the most recent favors
   * @method new
   */

  $scope.new = function() {
    $scope.popular = false;
    $scope.filter = '-createdAt';
  };

  /**
   * Upvote the selected favor
   * @method upVote
   * @param {} favor
   */

  $scope.upVote = function(favor) {
    Favors.upVote(favor, 1);
  }; 

  /**
   * Downvote the selected favor
   * @method downVote
   * @param {} favor
   */

  $scope.downVote = function(favor) {
    Favors.downVote(favor, -1);
  };

  //toggle location search
  $scope.search = false;

  /**
   * toggle whether the searchbar is shown
   * @method toggleSearch
   */

  $scope.toggleSearch = function() {
    $scope.search = !$scope.search;
  }

  /**
   * Calculate distance between user and a favor
   * @method getDistance
   * @param {} location of the favor
   * @return Number distance b/w user and favor
   */

  $scope.getDistance = function(locationObject) {
    //calculates the distance between current location and a given location
    return geo.calculateDistance(locationObject.coordinates[1], locationObject.coordinates[0],
            +window.localStorage.getItem('latitude'), +window.localStorage.getItem('longitude'));
  }

  /**
   * enable tracking of user's location
   * @method enableTracking
   */

  $scope.enableTracking = function() {
    geo.backgroundTracking();
  };

  //Initialization Code:

  var areaZoom = 16;
  var markerMap = {};

  //initialize the hidden map, used to filter location of requests

  uiGmapGoogleMapApi.then(function(maps) {
    //console.log('initializing the feed map...');
      
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
        bounds_changed: function(map, eventName) {}
      }
    };
      
    markerMap = {};

    $timeout(function() {
      var map = $scope.map.control.getGMap();
      if (map) {
        //mapService.addBoundsListener(map, markerMap);
        mapService.addPlaceChangedListener(map, 'feedMap');
      }
    });

    $scope.options = {
      scrollwheel: false
    };

    $scope.map.markers = [];
  });

  //on view load, fetch favors from server
  $scope.updateFavors();

});

