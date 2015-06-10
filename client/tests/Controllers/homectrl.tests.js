describe('homeCtrl', function() {
  var scope;
  var favors;
  var upVoting;
  
  var domain = "http://localhost:3000";
  var access = 'test';

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

  beforeEach(inject(function($injector, $rootScope, $controller, Favors, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    favors = Favors;
    auth = Auth;
    $controller('homeCtrl', {$scope: scope});
    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVote?access_token='+access).respond('1');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

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

  it('should upvote a favor', function() {
    var favor = { votes: 0 };
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVote?access_token='+access);
    scope.upVote(favor);
    $httpBackend.flush();
    expect(favor.votes).toEqual(1);
  });
  
  it('should downvote a favor', function() {
    var favor = { votes: 0 };
    upVoting.respond('-1');
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVote?access_token='+access);
    scope.upVote(favor);
    $httpBackend.flush();
    expect(favor.votes).toEqual(-1);
  });
});
