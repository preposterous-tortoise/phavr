angular.module('phavr.home', [])
.controller('homeCtrl', function ($scope, $rootScope, $location, $http, Favors, Photos, geo, mapService, uiGmapGoogleMapApi, $timeout){

  //this is needed so that header bar can be ngshown
  $rootScope.login = true;

  /**
  * Methods related to Favors
  */

  $scope.favors = [];/*[{_id: 1, topic: 'nyancat', description: 'send me ur nyans', topPhoto: 'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG', votes: 2, distance: 0.256, camera: true}, {_id: 1, topic: 'meowmeowmeow', description: 'mirror mirror on the wall, who is the longest cat of all', topPhoto: 'http://www.autofish.net/mirrors/images/animals/cats/long_cat.jpg', votes: 2, distance: 0.256, camera: true}];*/

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.updateFavors = function(){
    console.log('attempting to update favors...');
    //geo.getLocation(function(spot){
    console.log('map bounds', mapService.mapBounds);

    if(mapService.mapBounds === null) {
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



        Favors.fetchRequests(box, function(data){
          //for each favor attach distance to current location
          data.forEach(function(favor){
            favor.distance = $scope.getDistance(favor.loc);
            //show camera icon if favor distance is less than 5 miles
            favor.camera = favor.distance < 5;
          });
          //fetch favors from the dtabase
          $scope.favors = data;
          $scope.getTopPhotos();
        });
      });
    } else{ 
        Favors.fetchRequests(mapService.mapBounds, function(data){
          $scope.favors = data;
          //for each favor attach distance to current location
          $scope.favors.forEach(function(favor){
            favor.distance = $scope.getDistance(favor.loc);
            //show camera icon if favor distance is less than 5 miles
            favor.camera = favor.distance < 5;
          });
          $scope.getTopPhotos();
        });
    }

    //get top photos for favors

    //$scope.getTopPhotos();
    //geo.backgroundTracking();

    


  };

  //upon clicking on favors, user will be redirected to favor details page
  $scope.favorDetails = function(favor){
    Favors.setFavor(favor);
    $location.path('/favordetails');
  }

  $scope.getTopPhotos = function(requests) {
    //for each fetched request, display the top photo

    for(var i = 0; i < $scope.favors.length; i++) {
      //fetch the photos for this request
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
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };


  /**
  * Sorting of favors
  */
  
  //by default will be most reent
  $scope.filter = '-createdAt';

  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  $scope.new = function() {
    $scope.filter = '-createdAt';
  };

  $scope.upVote = function(favor) {
    Favors.upVote(favor, 1);
  }; 

  $scope.downVote = function(favor) {
    Favors.downVote(favor, -1);
  };


  /*
  *Search bar (location search)
  */  
  $scope.toggle = false;
  $scope.setToggle = function() {
    $scope.toggle = !$scope.toggle;
  }

  /*
  *Methods related to map and location
  */
  $scope.getDistance = function(locationObject) {
    //calculates the distance between current location and a given location
    return geo.calculateDistance(locationObject.coordinates[1], locationObject.coordinates[0], 
                  +window.localStorage.getItem('latitude'), +window.localStorage.getItem('longitude') );

  }

  var areaZoom = 16;
  var markerMap = {};

  uiGmapGoogleMapApi.then(function(maps) {
      console.log('initializing the feed map...');
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
          }
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

  $scope.enableTracking = function(){
    // geo.enableTracking();
    geo.backgroundTracking();
  };

  /*
  *Initialization code
  */
  $scope.updateFavors();

});

