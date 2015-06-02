describe('homeCtrl', function() {
  // var google;

  beforeEach(function() {
    module('drakeApp.favorfact');
    module('drakeApp.home');
    module('drakeapp.photoFactory');
    module('drakeapp.locationFactory');
    module('drakeApp.mapService');
    module('drakeapp.authFactory');
    module('drakeApp.navfact');
    module('drakeApp.mapService');
    module('drakeapp.locationFactory');
    module('ngCordovaMocks');
    module('drakeApp.navfact');

  });

  var nav;
  beforeEach(inject(function($rootScope, _Nav_) {
    nav = _Nav_;
  }));  

  it('should have navBar set to true', function() {
    expect(nav.navBar).toEqual(true);
  });

  it('shoule set navBar value', function() {
    nav.setBar(false);
    expect(nav.navBar).toEqual(false);
  });

});
