angular.module('drakeApp.favorfact', [])
.factory('Favors', function ($http, $location, Auth){


  var domain;
  if (ionic.Platform.isIOS() || ionic.Platform.isAndroid() || 
    $location.host() === 'drakeapp.herokuapp.com') {
    domain = "http://drakeapp.herokuapp.com";
  } else {
    domain = "http://localhost:3000";
  }

  return {
    saveRequest: function(request) {
      $http({
        method: 'POST',
        url: domain +'/api/requests/create?access_token='+Auth.accessToken,
        data: request
      })
      .success(function(data, status, headers, config) {
        return data;
        console.log("THIS IS WHAT IS INSIDE A REQUEST "+request);
      })
      .error(function(data, status, headers, config) {
        console.log('saveRequest error, ', data, status, headers, config);
      });
    },
    //  fetch requests in the specified box: [[sw.lng, sw.lat], [ne.lng, ne.lat]]
    fetchRequests: function(box, callback) {
      return $http({
          method: 'POST',
          url: domain+'/api/requests?access_token='+Auth.accessToken,
          data: {
            box: box
          }
        })
        .success(function(requests, status, headers, config) {

          if (callback) callback(requests)
          return requests;
        })
        .error(function(data, status, headers, config) {
          console.log('fetchRequests error: ', data, status, headers, config);
          return null;
        });
    },
    
    upVote: function(favor, vote){
      console.log("inside requestfactory upvote")
      return $http({
        method: 'POST',
        url: domain+'/api/votes/upVote?access_token='+Auth.accessToken,
        data: { favor: favor, vote: vote }
      })
      .then(function(resp){ //response will be -1, 0 or 1
        console.log('votes',favor.votes);
        console.log(resp.data);
        favor.votes += +resp.data;
        console.log(JSON.stringify(resp.data));
      })
    },
    downVote: function(favor, vote){
      return $http({
        method: 'POST',
        url: domain+'/api/votes/upVote?access_token='+Auth.accessToken,
        data: { favor: favor, vote: vote }
      })
      .then(function(resp){
        favor.votes += +resp.data;
        console.log(resp);
      })
      
    },
    
    selectedFavor: null,

    setFavor: function(request) {
      this.selectedFavor = request;
    }
  }
});
