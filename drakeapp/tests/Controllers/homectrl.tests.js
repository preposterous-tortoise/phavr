describe('homeCtrl', function() {
  var scope;
  // var google;

  beforeEach(function() {
  	/*google = {
	    maps : {
	        LatLng : function () {
	        },
	        Marker : function () {
	        },
	        InfoWindow : function () {
	        }
	    }
	  };*/
  	module('drakeApp.favorfact')
  	module('drakeApp.home');
  	module('drakeapp.photoFactory');
  	module('drakeapp.locationFactory');
  	module('ngCordovaMocks');
  	module('drakeApp.mapService');

  });

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('homeCtrl', {$scope: scope});
  }));

  it('should have testVar set to true', function() {
    expect(scope.testVar).toEqual(true);
  });
});
