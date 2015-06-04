<<<<<<< HEAD
angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $rootScope, $location, $http, Favors, photoFactory, geo, Nav, mapService, uiGmapGoogleMapApi, $timeout){


  $rootScope.login = true;

  $scope.mapBounds = mapService.mapBounds;

  $scope.favors = [];

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(favor) {
    console.log("THIS IS FAVOR "+JSON.stringify(favor));
    Favors.upVote(favor, 1);
  }; 

  $scope.downVote = function(favor) {
    Favors.downVote(favor, -1);
  };


  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }

  $scope.updateFavors = function(){
    console.log('attempting to update favors...');
=======
angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $rootScope, $location, $http, Favors, photoFactory, geo, Nav, mapService, uiGmapGoogleMapApi, $timeout){
 

  $rootScope.login = true;

  $scope.mapBounds = mapService.mapBounds;

  $scope.favors = [{_id: 1, topic: 'req1', description: 'blah', votes: 0},
                    {_id: 2, topic: 'req2', description: 'blah', votes: 0}];

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(favor) {
    console.log("THIS IS FAVOR "+JSON.stringify(favor));
    Favors.upVote(favor, 1);
  }; 

  $scope.downVote = function(favor) {
    Favors.downVote(favor, -1);
  };


  $scope.favorDetails = function(favor){

    Favors.setFavor(favor);
    console.log(Favors.selectedFavor);
    $location.path('/favordetails');
  }

  $scope.updateFavors = function(){
    console.log('attempting to update favors...');
>>>>>>> change styles, add pull-to-refresh
    //geo.getLocation(function(spot){
    console.log('map bounds', mapService.mapBounds);
    if(mapService.mapBounds === null) {
      console.log('mapBounds was null, getting user location...');
      geo.phoneLocation(function(spot) {
        console.log('getting location');

        var radius = 0.289855;
        var box = [[spot.coords.longitude-radius, spot.coords.latitude-radius], [spot.coords.longitude+radius, spot.coords.latitude+radius]];
        window.localStorage.setItem('longitude', spot.coords.longitude.toString());
        window.localStorage.setItem('latitude', spot.coords.latitude.toString());
        console.log(box);

        Favors.fetchRequests(box, function(data){
          $scope.favors = data;
          $scope.favors.forEach(function(favor){
            favor.distance = $scope.getDistance(favor.loc);
            favor.camera = favor.distance < 5;
          });
          
          console.log($scope.favors);
          $scope.getTopPhotos();
        });
      });
    } else { 
        console.log('mapBounds was defined! Getting requests in those map bounds...');
        Favors.fetchRequests(mapService.mapBounds, function(data){
          console.log('got requests', data);
          $scope.favors = data;
          console.log($scope.favors);
          $scope.getTopPhotos();
        });
    }
        
  };

  $scope.getDistance = function(locationObject) {
    var distance = geo.calculateDistance(locationObject.coordinates[1], locationObject.coordinates[0], +window.localStorage.getItem('latitude'), +window.localStorage.getItem('longitude') );
    console.log(distance);
    return distance;
  }
  
  $scope.getTopPhotos = function(requests) {
    //for each fetched request, display the top photo
    console.log('getting top photos...');
    for(var i = 0; i < $scope.favors.length; i++) {
      console.log($scope.favors[i]);
      //fetch the photos for this request
      var currentFavor = $scope.favors[i];
      console.log('calling getPhotosForFavor with', $scope.favors[i]);

      (function(currentFavor) {

      photoFactory.getPhotosForFavor(currentFavor, function(photos) {
        //find the photo with the most votes
        console.log(photos);
        console.log(currentFavor);
        var topVotes = Number.NEGATIVE_INFINITY;
        var topPhoto = null;
        for(var j = 0; j < photos.length; j++) {
          if(photos[j].votes > topVotes) {
            topVotes = photos[j].votes;
            topPhoto = photos[j];
          }
        }
        console.log(currentFavor);
        currentFavor.topPhoto = topPhoto.url;
        console.log('top photo', currentFavor.topPhoto);
        console.log($scope.favors);
      });
      })($scope.favors[i]);

    }

    $scope.$broadcast('scroll.refreshComplete');

  };

  $scope.enableTracking = function(){
    geo.enableTracking();
  };

  $scope.filter = '-createdAt';

  $scope.hot = function(){
    $scope.filter = '-votes';
  };

  $scope.new = function() {
    $scope.filter = '-createdAt';
  };

  $scope.getPic = function() {
    console.log("YO GET PIC IS HAPPENING!")
    Favors.getUserInfo();
  }

  $scope.getPic();

  $scope.testVar = true;
  //$scope.updateFavors();


  $scope.toggle = false;
  $scope.setToggle = function() {
    $scope.toggle = !$scope.toggle;
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
            // console.log(' NEW BOUNDS: ', JSON.stringify(mapService.getBoxForBounds(map.getBounds())));
            //updateMarkers(map.getBounds());
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


});

