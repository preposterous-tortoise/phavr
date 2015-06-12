/*
 * Favor Factory
 *
 * This handles all functions relating to favors
 * Includes fetching favors, saving new favors, and up/down-voting favors
 *
 */
angular.module('phavr.favorfact', [])
.factory('Favors', function($http, $location, Auth) {

  //set domain for $http requests
  var domain = localStorage.getItem("domain") || "http://phavr.herokuapp.com";
  
  return {
    /**
     * set the domain for $http requests
     * @method setDomain
     * @param {} newDomain
     */

    setDomain: function(newDomain) {
      domain = newDomain;
    },

    /**
     * save a new favor to the database
     * @method saveFavor
     * @param {} favor to save
     * @return {} the newly created favor
     */

    saveFavor: function(favor) {
      //console.log('saving favor...');

      $http({
        method: 'POST',
        url: domain + '/api/requests/create',
        data: favor
      })
      .success(function(data, status, headers, config) {
        return data;
      })
      .error(function(data, status, headers, config) {
        console.log('saveRequest error, ', data, status, headers, config);
      });
    },

    /**
     * fetch requests in the specified box: [[sw.lng, sw.lat], [ne.lng, ne.lat]]
     * @method fetchFavors
     * @param {} box
     * @param {} callback
     * @return {} the requests in this location
     */

    fetchFavors: function(box, callback) {
      //console.log("fetching favors from server...");
      
      return $http({
          method: 'POST',
          url: domain + '/api/requests',
          data: {
            box: box
          }
        })
        .success(function(requests, status, headers, config) {

          if (callback) { callback(requests) }
          return requests;
        })
        .error(function(data, status, headers, config) {
          console.log('fetchRequests error: ', data, status, headers, config);
          return null;
        });
    },

    /**
     * get all the favors created by the specified user
     * @method profileFavors
     * @param {} user
     * @return {} the favors created by user
     */

    profileFavors: function(user) {
      //console.log('getting this user's favors...');

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
     * increase the favor's votes by 1
     * @method upVote
     * @param {} favor
     * @param {} vote
     * @return Number to update the displayed value
     */

    upVote: function(favor, vote) {
      //console.log('upvoting...')
      return $http({
        method: 'POST',
        url: domain + '/api/votes/upVote',
        data: { favor: favor, vote: vote }
      })
      .then(function(resp){ //response will be -1, 0 or 1
        //console.log('vote value', resp);
        favor.votes += +resp.data;
      })
    },

    /**
     * decrease the favor's votes by 1
     * @method downVote
     * @param {} favor
     * @param {} vote
     * @return Number to update the displayed value
     */

    downVote: function(favor, vote){
      return $http({
        method: 'POST',
        url: domain + '/api/votes/upVote',
        data: { favor: favor, vote: vote }
      })
      .then(function(resp){
        //console.log('vote value', resp);
        favor.votes += +resp.data;
      })
    },
    
    selectedFavor: null, //the favor to display in favordetails view

    /**
     * set selectedFavor
     * @method setFavor
     * @param {} request
     */

    setFavor: function(request) {
      this.selectedFavor = request;
    }
  }
});

