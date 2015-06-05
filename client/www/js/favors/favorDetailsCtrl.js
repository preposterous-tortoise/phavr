angular.module('phavr.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, Photos, Favors, $cordovaFile, $timeout){

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.selectedFavor.photos;   
  $scope.getPhoto = function(){

    var d = new Date();
    var time = d.getTime();
    var favorID = $scope.selectedFavor._id;
    console.log('time before getPicture', time);
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      Photos.getPicture(favorID, time );
      console.log('sending picture url...');
      console.log('time before sendPicture', time);
      Photos.sendPicture("https://s3.amazonaws.com/darrenphavr/"+time+"___"+favorID +".jpg", favorID);
    } else {
      Photos.sendPicture("http://images2.trippy.com/555cc3a5e4b0c050d882b87c_pm9.jpg", favorID);
    }
  };


  $scope.getInstagramPictures= function() {

    Photos.getInstagramPictures($scope.selectedFavor, function(data){

      $scope.requests = data.map(function(photo){
        return {photos: photo.images.standard_resolution.url};
      });


    });
  };

  $scope.getAllPhotos = function() {
    Photos.getPhotosForFavor(Favors.selectedFavor, function(data) {
      $scope.selectedFavor.photos = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.upVote = function(request) {
    Photos.upVote(photo, 1);
    // Favors.upVote(favorID);
  };

  $scope.downVote = function(request) {
    Photos.upVote(photo, -1);
    // Favors.downVote(favorID);

  };

  $scope.upVotePhoto = function(photo) {
    Photos.upVote(photo, 1);
    // Photos.upVote(photo.ID);
  };

  $scope.downVotePhoto = function(photo) {
    Photos.upVote(photo, -1);
    // Photos.downVote(photo.ID);

  };

  //   $scope.upVote = function(favor) {
  //   console.log("THIS IS FAVOR "+JSON.stringify(favor));
  //   Favors.upVote(favor, 1);
  // }; 

  // $scope.downVote = function(favor) {
  //   Favors.downVote(favor, -1);
  // };


  //get instagram pictures
  // $scope.getInstagramPictures();
  $scope.getAllPhotos();


});





