describe('favorFactory', function() {
  var $httpBackend;
  var $rootScope;

  beforeEach(function() {
    module('drakeApp.favorfact');
    module('drakeApp.home');
    module('drakeapp.photoFactory');
    module('drakeapp.locationFactory');
    module('ngCordovaMocks');
    module('drakeApp.mapService');
    module('drakeapp.authFactory');
    module('drakeApp.navfact');

  });
});

