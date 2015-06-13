/*
 * Favor Creation Map Controller
 *
 * Initializes the map in favor.html
 *
 */

angular.module('phavr.favorCreationMap', [])
.controller('FavorCreationMapCtrl', function($scope, Favors, mapService) {

  /**
    * initialize google map
    * @method init
    */

  $scope.init = function() {
    var markerMap = {};
    var map = mapService.createMap();

    mapService.addPlaceChangedListener(map, false);
    mapService.addDefaultMarker(map);
  }

  $scope.init();
});

