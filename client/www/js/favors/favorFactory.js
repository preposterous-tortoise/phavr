angular.module('phavr.favorfact', [])
.factory('Favors', function ($http, $location, Auth){


  var domain = localStorage.getItem("domain");
  console.log("domain is: ", domain);
  
  return {
    setDomain: function(newDomain) {
      domain = newDomain;
      console.log("after setDomain, domain is: ", domain);
    },

    saveRequest: function(request) {
      $http({
        method: 'POST',
        url: domain + '/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU',
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
      console.log("I'M INSIDE THE FETCH REQUESTS!");
      return $http({
          method: 'POST',
          url: domain + '/api/requests',
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

    profileFavors: function(user) {
      return $http({
          method: 'POST',
          url: domain + '/api/requests/grabFavor',
          data: user
        })
        .success(function(requests, status, headers, config) {
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
        url: domain + '/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU',
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
        url: domain + '/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU',
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
