describe('favorFactory', function() {
  var $httpBackend;
  var getFavorPhotos;
  var sendingPicture;
  var upVoting;

  var auth;
  var photo;

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

  beforeEach(inject(function($injector, photoFactory, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    photo = photoFactory;
    auth = Auth;

    getFavorPhotos = $httpBackend.when('POST', domain+'/api/photos/fetch?access_token='+access).respond('success');

    sendingPicture = $httpBackend.when('POST', domain+'/api/photos/create?access_token='+access).respond('success');
    
    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVotePhoto?access_token='+access).respond('success');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should send a photo url', function() {
    $httpBackend.expectPOST(domain+'/api/photos/create?access_token='+access);
    auth.setAccessToken(access);
    photo.sendPicture({ topic: 'test' });
    $httpBackend.flush();
  });
  
  it('should get photos for a favor', function() {
    $httpBackend.expectPOST(domain+'/api/photos/fetch?access_token='+access);
    auth.setAccessToken(access);
    photo.getPhotosForFavor({ topic: 'test' }, function() {});
    $httpBackend.flush();
  });

  it('should upvote a photo', function() {
    $httpBackend.expectPOST(domain+'/api/votes/upVotePhoto?access_token='+access);
    auth.setAccessToken(access);
    photo.upVote({ topic: 'test' });
    $httpBackend.flush();
  });
  
});
