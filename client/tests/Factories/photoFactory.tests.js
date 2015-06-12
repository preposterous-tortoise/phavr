describe('favorFactory', function() {
  var $httpBackend;
  var getFavorPhotos;
  var sendingPicture;
  var upVoting;
  var auth;
  var photo;
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

  beforeEach(inject(function($injector, Photos, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    photo = Photos;
    auth = Auth;

    getFavorPhotos = $httpBackend.when('POST', domain+'/api/photos/fetch').respond('success');

    sendingPicture = $httpBackend.when('POST', domain+'/api/photos/create').respond('success');
    
    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVotePhoto').respond('success');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should send a photo url', function() {
    $httpBackend.expectPOST(domain+'/api/photos/create');
    auth.setAccessToken(access);
    photo.sendPicture({ topic: 'test' });
    $httpBackend.flush();
  });
  
  it('should get photos for a favor', function() {
    $httpBackend.expectPOST(domain+'/api/photos/fetch');
    auth.setAccessToken(access);
    photo.getPhotosForFavor({ topic: 'test' }, function() {});
    $httpBackend.flush();
  });

  it('should upvote a photo', function() {
    $httpBackend.expectPOST(domain+'/api/votes/upVotePhoto');
    auth.setAccessToken(access);
    photo.upVote({ topic: 'test' });
    $httpBackend.flush();
  });
  
});
