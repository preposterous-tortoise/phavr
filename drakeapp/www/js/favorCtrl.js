angular.module('drakeApp.favor', [])
.controller('favorCtrl', function ($scope, $window, $location, Favors){

	$scope.createFavor = function() {
		var mapFavor = $scope.$$nextSibling.favor;
		$scope.favor.address = mapFavor.address;
		$scope.favor.place_name = mapFavor.place_name;
		$scope.favor.location = mapFavor.location;
		$scope.favor.icon = mapFavor.icon;
		Favors.saveRequest($scope.favor);
		$window.location = '/';
	};

});

