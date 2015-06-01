describe('homeCtrl', function() {
  var scope;
  var favors;
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
  	module('drakeApp.favorfact');
  	module('drakeApp.home');
  	module('drakeapp.photoFactory');
  	module('drakeapp.locationFactory');
  	module('ngCordovaMocks');
  	module('drakeApp.mapService');
        module('drakeapp.authFactory');
        module('drakeApp.navfact');

  });

  beforeEach(inject(function($rootScope, $controller, Favors) {
    scope = $rootScope.$new();
    favors = Favors;
    $controller('homeCtrl', {$scope: scope});
  }));

  it('should have testVar set to true', function() {
    expect(scope.testVar).toEqual(true);
  });

  it('should be getting the selected favor from favor factory', function() {
    expect(scope.selectedFavor).toEqual(null);
  });

  it('should set the clicked favor as the selectedFavor', function() {
    var request = { _id: 1, topic: 'testRequest' };
    scope.favorDetails(request);
    expect(favors.selectedFavor).toEqual(request);
  });

});
