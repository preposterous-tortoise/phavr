angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory, Favors, $cordovaFile){

  $scope.selectedFavor = Favors.selectedFavor;

  
  $scope.getPhoto = function(){

    //TODO REPLACE FAVOR ID WITH APPROPRIATE FAVOR ID
    var d = new Date();
    var time = d.getTime();
    var favorID = $scope.selectedFavor._id;
    photoFactory.getPicture(favorID, time );
    photoFactory.sendPicture("https://s3.amazonaws.com/darrendrakeapp/"+time+"___"+favorID +".jpg")

  };


  $scope.getInstagramPictures= function() {

    photoFactory.getInstagramPictures($scope.selectedFavor, function(data){

      $scope.requests = data.map(function(photo){
        return {photos: photo.images.standard_resolution.url};
      });


    });
  };

  $scope.getAllPhotos = function() {
    photoFactory.getPhotosForFavor(Favors.selectedFavor, function(data) {
      $scope.selectedFavor.photos = data;
    });

    console.log($scope.selectedFavor);

  };

  $scope.upVote = function(request) {
    request.votes++;
    // Favors.upVote(favorID);
  };

  $scope.downVote = function(request) {
    request.votes--;
    // Favors.downVote(favorID);

  };

  $scope.upVotePhoto = function(photo) {
    request.votes++;
    // photoFactory.upVote(photo.ID);
  };

  $scope.downVotePhoto = function(photo) {
    request.votes--;
    // photoFactory.downVote(photo.ID);

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





