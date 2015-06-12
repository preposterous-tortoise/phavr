describe('favorFactory', function() {
  var $httpBackend;
  var savingRequest;
  var sendingRequest;
  var upVoting;
  var auth;
  var favor;
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

  });

  beforeEach(inject(function($injector, Favors, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    favor = Favors;
    auth = Auth;

    savingRequest = $httpBackend.when('POST', domain+'/api/requests/create').respond('success');

    sendingRequest = $httpBackend.when('POST', domain+'/api/requests').respond({ topic: 'test' });
    
    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVote').respond('success');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should save a favor', function() {
    $httpBackend.expectPOST(domain+'/api/requests/create');
    auth.setAccessToken(access);
    favor.saveFavor({ topic: 'test' });
    $httpBackend.flush();
  })

  it('should fetch requests from the server', function() {
    $httpBackend.expectPOST(domain+'/api/requests');
    auth.setAccessToken(access);
    favor.fetchFavors([]);
    $httpBackend.flush();
  });

  it('should upvote a request', function() {
    $httpBackend.expectPOST(domain+'/api/votes/upVote');
    auth.setAccessToken(access);
    favor.upVote(1);
    $httpBackend.flush();
  });

  it('should set the selected favor', function() {
    favor.setFavor({});
    expect(favor.selectedFavor).toEqual({});
  });  

});

