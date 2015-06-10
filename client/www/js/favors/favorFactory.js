angular.module('phavr.favorfact', [])
.factory('Favors', function ($http, $location, Auth){


  var domain = localStorage.getItem("domain") || "http://phavr.herokuapp.com";
  console.log("domain is: ", domain);
  
  return {
    /**
     * Description
     * @method setDomain
     * @param {} newDomain
     * @return 
     */
    setDomain: function(newDomain) {
      domain = newDomain;
      console.log("after setDomain, domain is: ", domain);
    },

    /**
     * Description
     * @method saveRequest
     * @param {} request
     * @return 
     */
    saveRequest: function(request) {
      $http({
        method: 'POST',
        url: domain + '/api/requests/create',
        data: request
      })
      .success(function(data, status, headers, config) {
        return data;
      })
      .error(function(data, status, headers, config) {
        console.log('saveRequest error, ', data, status, headers, config);
      });
    },
    //  fetch requests in the specified box: [[sw.lng, sw.lat], [ne.lng, ne.lat]]
    /**
     * Description
     * @method fetchRequests
     * @param {} box
     * @param {} callback
     * @return CallExpression
     */
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

    /**
     * Description
     * @method profileFavors
     * @param {} user
     * @return CallExpression
     */
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
    
    /**
     * Description
     * @method upVote
     * @param {} favor
     * @param {} vote
     * @return CallExpression
     */
    upVote: function(favor, vote){
      console.log("inside requestfactory upvote")
      return $http({
        method: 'POST',
        url: domain + '/api/votes/upVote',
        data: { favor: favor, vote: vote }
      })
      .then(function(resp){ //response will be -1, 0 or 1
        console.log('votes',favor.votes);
        console.log(resp.data);
        favor.votes += +resp.data;
        console.log(JSON.stringify(resp.data));
      })
    },
    /**
     * Description
     * @method downVote
     * @param {} favor
     * @param {} vote
     * @return CallExpression
     */
    downVote: function(favor, vote){
      return $http({
        method: 'POST',
        url: domain + '/api/votes/upVote',
        data: { favor: favor, vote: vote }
      })
      .then(function(resp){
        favor.votes += +resp.data;
        console.log(resp);
      })
      
    },
    
    selectedFavor: null,

    /**
     * Description
     * @method setFavor
     * @param {} request
     * @return 
     */
    setFavor: function(request) {
      this.selectedFavor = request;
    }
  }
});
