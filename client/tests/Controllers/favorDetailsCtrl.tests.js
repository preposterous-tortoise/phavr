describe('favorDetailsCtrl', function() {
  var scope;
  var auth;
  var favors;
  var photos;
  var getPhotos;
  var upVoting;
  var selected;
  var domain = "http://phavr.herokuapp.com";
  var access = 'test';

  beforeEach(function() {
    module('ngCordovaMocks');
    module('phavr.home');
    module('phavr.favorfact');
    module('phavr.favorDetails');
    module('phavr.photoFactory');
    module('phavr.locationFactory');
    module('phavr.mapService');
    module('phavr.authFactory');
    module('phavr.nav');
  });

  beforeEach(inject(function($injector, $rootScope, $controller, Favors, Photos, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();

    favors = Favors;
    photos = Photos;
    auth = Auth;

    selected = { _id: 1,  photos: []};
    favors.setFavor(selected);
    auth.setAccessToken(access);

    $controller('favorDetailsCtrl', {$scope: scope});

    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVotePhoto').respond('1');

    getPhotos = $httpBackend.when('POST', domain+'/api/photos/fetch').respond(['photo1', 'photo2']);

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get all the photos for a request', function() {
    //$httpBackend.flush();
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/photos/fetch');
    $httpBackend.flush();

    $httpBackend.expectPOST(domain+'/api/photos/fetch');
    scope.getAllPhotos();
    expect(scope.selectedFavor.photos).toEqual(['photo1','photo2']);
    $httpBackend.flush();
  });

  it('should upvote a photo', function() {
    var photo = { votes: 0 };
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVotePhoto');
    scope.upVote(photo);
    $httpBackend.flush();
    expect(photo.votes).toEqual(1);
  });
  
  it('should downvote a photo', function() {
    var photo = { votes: 0 };
    upVoting.respond('-1');
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVotePhoto');
    scope.downVote(photo);
    $httpBackend.flush();
    expect(photo.votes).toEqual(-1);
  });

});
