angular.module('drakeApp.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, photoFactory, Favors, $cordovaFile, Nav){

  $scope.selectedFavor = Favors.selectedFavor;

  $scope.selectedFavor.photos = [{url: 'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG', votes: 0}, {url: 'https://pbs.twimg.com/profile_images/458794430200152064/XdQULww6.png', votes: 0}, {url: 'http://img2.wikia.nocookie.net/__cb20070412005925/uncyclopedia/images/1/17/331px-Longcat.jpg', votes: 0}];
  
  $scope.getPhoto = function(){

    var d = new Date();
    var time = d.getTime();
    var favorID = $scope.selectedFavor._id;
    console.log('time before getPicture', time);
    photoFactory.getPicture(favorID, time );
    console.log('sending picture url...');
    console.log('time before sendPicture', time);
    photoFactory.sendPicture("https://s3.amazonaws.com/darrendrakeapp/"+time+"___"+favorID +".jpg", favorID);

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
  };

  $scope.upVote = function(request) {
    photoFactory.upVote(photo, 1);
    // Favors.upVote(favorID);
  };

  $scope.downVote = function(request) {
    photoFactory.upVote(photo, -1);
    // Favors.downVote(favorID);

  };

  $scope.upVotePhoto = function(photo) {
    photoFactory.upVote(photo, 1);
    // photoFactory.upVote(photo.ID);
  };

  $scope.downVotePhoto = function(photo) {
    photoFactory.upVote(photo, -1);
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
  //$scope.getAllPhotos();


});





