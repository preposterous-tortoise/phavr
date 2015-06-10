describe('favorDetailsCtrl', function() {
  var scope;
  var favors;
  var photos;
  var getPhotos;
  var upVoting;
  var selected;
  var domain = "http://localhost:3000";
  var access = 'test';

  beforeEach(function() {
    module('drakeApp.favorfact');
  	module('drakeApp.home');
    module('drakeApp.favorDetails');
  	module('drakeapp.photoFactory');
  	module('drakeapp.locationFactory');
  	module('ngCordovaMocks');
    module('drakeApp.favorfact');
  	module('drakeApp.mapService');
    module('drakeapp.authFactory');
    module('drakeApp.navfact');
  });

  beforeEach(inject(function($injector, $rootScope, $controller, Favors, photoFactory, Auth) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();

    favors = Favors;
    photos = photoFactory;
    auth = Auth;

    selected = { _id: 1,  photos: []};
    favors.setFavor(selected);
    auth.setAccessToken(access);

    $controller('favorDetailsCtrl', {$scope: scope});

    upVoting = $httpBackend.when('POST', domain+'/api/votes/upVotePhoto?access_token='+access).respond('1');

    getPhotos = $httpBackend.when('POST', domain+'/api/photos/fetch?access_token='+access).respond(['photo1', 'photo2']);

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get all the photos for a request', function() {
    //$httpBackend.flush();
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/photos/fetch?access_token='+access);
    $httpBackend.flush();

    $httpBackend.expectPOST(domain+'/api/photos/fetch?access_token='+access);
    scope.getAllPhotos();
    expect(scope.selectedFavor.photos).toEqual(['photo1','photo2']);
    $httpBackend.flush();
  });

  it('should upvote a photo', function() {
    var photo = { votes: 0 };
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVotePhoto?access_token='+access);
    scope.upVotePhoto(photo);
    $httpBackend.flush();
    expect(photo.votes).toEqual(1);
  });
  
  it('should downvote a photo', function() {
    var photo = { votes: 0 };
    upVoting.respond('-1');
    auth.setAccessToken(access);
    $httpBackend.expectPOST(domain+'/api/votes/upVotePhoto?access_token='+access);
    scope.downVotePhoto(photo);
    $httpBackend.flush();
    expect(photo.votes).toEqual(-1);
  });

});
