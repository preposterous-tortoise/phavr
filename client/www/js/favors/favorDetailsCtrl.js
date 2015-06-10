angular.module('phavr.favorDetails', [])
.controller('favorDetailsCtrl', function ($scope, $location, $http, Photos, Favors, $cordovaFile, $timeout){

  $scope.selectedFavor = Favors.selectedFavor;

  /**
   * $scope.selectedFavor.photos = [{votes:0, url:'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG'}, {votes:0, url:'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG'}, {votes:0, url:'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG'}];   
   * @method getPhoto
   * @return 
   */
  $scope.getPhoto = function(){

    var d = new Date();
    var time = d.getTime();
    var favorID = $scope.selectedFavor._id;
    console.log('time before getPicture', time);
    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      Photos.getPicture(favorID, time);
      console.log('sending picture url...');
      console.log('time before sendPicture', time);
      //Photos.sendPicture("https://s3.amazonaws.com/darrenphavr/"+time+"___"+favorID +".jpg", favorID);
    } else {
      var photoURL = window.prompt("Enter a photo URL: ", "http://images2.trippy.com/555cc3a5e4b0c050d882b87c_pm9.jpg");
      if (photoURL) {
        Photos.sendPicture(photoURL, favorID);
      }
    }
  };


  /**
   * Description
   * @method getInstagramPictures
   * @return 
   */
  $scope.getInstagramPictures= function() {

    Photos.getInstagramPictures($scope.selectedFavor, function(data){

      $scope.requests = data.map(function(photo){
        return {photos: photo.images.standard_resolution.url};
      });


    });
  };

  /**
   * Description
   * @method getAllPhotos
   * @return 
   */
  $scope.getAllPhotos = function() {
    Photos.getPhotosForFavor(Favors.selectedFavor, function(data) {
      $scope.selectedFavor.photos = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  /**
   * Description
   * @method upVote
   * @param {} request
   * @return 
   */
  $scope.upVote = function(request) {
    Photos.upVote(photo, 1);
    // Favors.upVote(favorID);
  };

  /**
   * Description
   * @method downVote
   * @param {} request
   * @return 
   */
  $scope.downVote = function(request) {
    Photos.upVote(photo, -1);
    // Favors.downVote(favorID);

  };

  /**
   * Description
   * @method upVotePhoto
   * @param {} photo
   * @return 
   */
  $scope.upVotePhoto = function(photo) {
    Photos.upVote(photo, 1);
    // Photos.upVote(photo.ID);
  };

  /**
   * Description
   * @method downVotePhoto
   * @param {} photo
   * @return 
   */
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





