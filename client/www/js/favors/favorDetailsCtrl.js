/*
 * Favor Details Controller
 *
 * Corresponds to favorDetails.html, displays a single selected favor
 * Displays title, description, votes and all photos submitted for the favor.
 *
 * Users can upvote/downvote photos from this view.
 *
 */

angular.module('phavr.favorDetails', [])
.controller('favorDetailsCtrl', function($scope, $location, $http, Photos, Favors, $cordovaFile, $timeout) {

  //the favor that's being displayed
  $scope.selectedFavor = Favors.selectedFavor;
  
  //hard-coded photos, for testing purposes:

  /*$scope.selectedFavor.photos = [
    { votes:0, 
      url:'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG'
    }, 
    { votes:0, 
      url:'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG'
    }, 
    { votes:0, 
      url:'http://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG'
    }];*/

  /**
   * take a photo to upload
   * @method getPhoto
   */

  $scope.getPhoto = function() {
    var d = new Date();
    var time = d.getTime();
    var favorID = $scope.selectedFavor._id;
    
    if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      Photos.getPicture(favorID, time);
    } else {
        var photoURL = window.prompt("Enter a photo URL: ", "http://images2.trippy.com/555cc3a5e4b0c050d882b87c_pm9.jpg");
        if(photoURL) {
          Photos.sendPicture(photoURL, favorID);
        }
      }
  };

  /**
   * scrape photos from instagram (currently unused)
   * @method getInstagramPictures
   * @return {} photos from instagram
   */

  $scope.getInstagramPictures= function() {

    Photos.getInstagramPictures($scope.selectedFavor, function(data) {
      $scope.requests = data.map(function(photo) {
        return { photos: photo.images.standard_resolution.url };
      });
    });
  };

  /**
   * fetch all photos for the selected favor
   * @method getAllPhotos
   */

  $scope.getAllPhotos = function() {
    Photos.getPhotosForFavor(Favors.selectedFavor, function(data) {
      $scope.selectedFavor.photos = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  /**
   * increase the photo's votes by 1
   * @method upVote
   * @param {} photo
   */

  $scope.upVote = function(photo) {
    Photos.upVote(photo, 1);
  };

  /**
   * decrease the photo's votes by 1
   * @method downVote
   * @param {} photo
   */

  $scope.downVote = function(photo) {
    Photos.upVote(photo, -1);
  };

  //get instagram pictures
  //$scope.getInstagramPictures();
  
  //get photos
  $scope.getAllPhotos();
});

