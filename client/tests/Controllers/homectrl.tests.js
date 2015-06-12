describe('homeCtrl', function() {
  var scope;
  var favors;
  var upVoting;
  
  var domain = "http://phavr.herokuapp.com";
  var access = 'test';

  beforeEach(function() {
    module('phavr.favorfact');
    module('phavr.home');
    module('phavr.photoFactory');
    module('phavr.locationFactory');
    module('ngCordovaMocks');
    module('phavr.mapService');
    module('phavr.authFactory');
    module('phavr.nav');
    module('uiGmapgoogle-maps');

  });

  beforeEach(inject(function($injector, $rootScope, $controller, Favors, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    favors = Favors;
    auth = Auth;
    $controller('homeCtrl', {$scope: scope});
    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVote').respond('1');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
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
    $httpBackend.expectPOST(domain+'/api/votes/upVote');
    scope.upVote(favor);
    $httpBackend.flush();
    expect(favor.votes).toEqual(1);
  });
  
  it('should downvote a favor', function() {
    var favor = { votes: 0 };
    upVoting.respond('-1');
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVote');
    scope.upVote(favor);
    $httpBackend.flush();
    expect(favor.votes).toEqual(-1);
  });
});
