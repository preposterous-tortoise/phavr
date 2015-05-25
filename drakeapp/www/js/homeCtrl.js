angular.module('drakeApp.home', [])
.controller('homeCtrl', function ($scope, $location, Favors, photoFactory, geo){
 
  $scope.requests = [
    { 
      _id: 1,
      topic: 'LEMME SEE DRAKE',
      description: 'hey if somebody could take a pic of drake from the front row, that would be rad',
      photos: ["http://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/838px-Golden_State_Warriors_logo.svg.png"],
      hasPhotos: false,
      votes: 0
    },
    {
      _id: 2,
      topic: 'black tshirt',
      description: 'take a picture of somebody wearing a black t-shirt plz',
      photos: [],
      hasPhotos: false,
      votes: 0
    }
  ];

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.upVote = function(request) {
    request.votes++;
    // drakeApp.favorfact.upVote(favorID);
    geo.getLocation( function(result){
      console.log('hello');
      request.description = result[0] +","+ result[1];
    });

  }; 

  $scope.downVote = function(request) {
    request.votes--;
    // drakeApp.favorfact.downVote(favorID);
  };

  $scope.favorDetails = function(request){
    console.log(request);
    Favors.setFavor(request);
    $location.path('/favordetails');
  }

  $scope.updateFavors = function(){
    geo.getLocation(function(spot){
      console.log(spot);
      var radius = 0.289855;
      var box = [[spot[1]-radius, spot[0]-radius], [spot[1]+radius, spot[0]+radius]];
      console.log("THIS IS THE BOX " + box)
      Favors.fetchRequests(box, function(data){
        console.log("THIS IS FROM DATA "+data);
      })
    })
  };

  $scope.getPhoto = function(){
  	photoFactory.getPicture().then(function(image){
  		console.log(image);
      $scope.takenPhoto = image;
      photoFactory.sendPhoto(image);

  	}, function(err) {
  		console.log(err);
  	}, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    })
  };

  $scope.testVar = true;

});

