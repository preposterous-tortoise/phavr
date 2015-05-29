angular.module('drakeApp.favor', [])
.controller('favorCtrl', function ($scope, $window, $location, Favors, mapService, Nav){

  Nav.navBar = true;
	$scope.createFavor = function() {
		var mapFavor = mapService.favor; //$scope.$$nextSibling.favor;
		if (mapFavor) {
			$scope.favor.address = mapFavor.address;
			$scope.favor.place_name = mapFavor.place_name;
			$scope.favor.location = mapFavor.location;
			$scope.favor.icon = mapFavor.icon;
	  }
		Favors.saveRequest($scope.favor);
		$location.path('/');
	};

});

