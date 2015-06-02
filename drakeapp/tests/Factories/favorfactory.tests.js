describe('favorFactory', function() {
  var $httpBackend;
  var savingRequest;
  var sendingRequest;
  var upVoting;

  var auth;
  var favor;

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

  beforeEach(inject(function($injector, Favors, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    favor = Favors;
    auth = Auth;

    savingRequest = $httpBackend.when('POST', domain+'/api/requests/create?access_token='+access).respond('success');

    sendingRequest = $httpBackend.when('POST', domain+'/api/requests?access_token='+access).respond({ topic: 'test' });
    
    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVote?access_token='+access).respond('success');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should save a favor', function() {
    $httpBackend.expectPOST(domain+'/api/requests/create?access_token='+access);
    auth.setAccessToken(access);
    favor.saveRequest({ topic: 'test' });
    $httpBackend.flush();
  })

  it('should fetch requests from the server', function() {
    $httpBackend.expectPOST(domain+'/api/requests?access_token='+access);
    auth.setAccessToken(access);
    favor.fetchRequests([]);
    $httpBackend.flush();
  });

  it('should upvote a request', function() {
    $httpBackend.expectPOST(domain+'/api/votes/upVote?access_token='+access);
    auth.setAccessToken(access);
    favor.upVote(1);
    $httpBackend.flush();
  });

  it('should set the selected favor', function() {
    favor.setFavor({});
    expect(favor.selectedFavor).toEqual({});
  });  

});

