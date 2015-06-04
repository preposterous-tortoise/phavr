angular.module('phavr.requestCreationMap', [])
  .controller('FavorCreationMapCtrl', function($scope, Favors, mapService, Nav) {

    $scope.init = function() {
      var markerMap = {};
      var map = mapService.createMap();
      //mapService.addBoundsListener(map, markerMap);
      mapService.addPlaceChangedListener(map, false);
      mapService.addDefaultMarker(map);
    }

    $scope.init();

    // console.log('creation view');
    // _.defer(function(){
    //   var input = (document.getElementById('pac-input'));
    //   console.log('creation view deferred', input);
    //   $scope.init();
    // });

  });
