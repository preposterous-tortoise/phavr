/*
 * Favor Controller
 *
 * Corresponds to favor.html, which displays a form to submit a new request
 *
 */

angular.module('phavr.favor', [])
.controller('favorCtrl', function ($scope, $window, $location, Favors, mapService) {

  /**
   * gets form data and submits a new request to server
   * @method createFavor
   */

  $scope.createFavor = function() {
    //console.log('creating favor...');

    var mapFavor = mapService.favor; 
    if (mapFavor) {
      $scope.favor.address = mapFavor.address;
      $scope.favor.place_name = mapFavor.place_name;
      $scope.favor.location = mapFavor.location;
      $scope.favor.icon = mapFavor.icon;
    }
      
    Favors.saveFavor($scope.favor);
    $location.path('/home'); //redirect to home feed after submit
  };
});

