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
    { votes:9, 
      url:'http://cdn3.dogomedia.com/pictures/7604/content/breakersslideshow_1002174528_Bay_to_Breakers.JPEG-02a2e.JPG?1305661329'
    }, 
    { votes:7, 
      url:'http://static.flickr.com/46/150822933_eca78248f8.jpg'
    }, 
    { votes:5,
      url:'https://c1.staticflickr.com/1/18/23707338_2a7bce3aeb_b.jpg'
    },
    { votes:-1, 
      url:'http://www.obsessionwithbutterflies.com/img/butterfly/monarch%20Caterpillar.jpg'
    },
    { votes: 6,
      url: 'http://www.rentcafe.com/blog/wp-content/uploads/2012/05/breakers.jpg'
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

