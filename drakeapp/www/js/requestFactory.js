angular.module('drakeApp.favorfact', [])
.factory('Favors', function ($http, $location){


  var process = {env: {}};
  process.env.PRODUCTION = true;
  var domain;
  if(process.env.PRODUCTION) {
    domain = "http://drakeapp.herokuapp.com";
  } else {
    domain = "http://localhost:3000";
  }



  return {
    saveRequest: function(request) {
      $http({
        method: 'POST',
        url: 'http://drakeapp.herokuapp.com/api/requests/create',
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
    fetchRequests: function(box, callback) {
      return $http({
          method: 'POST',
          url: domain + '/api/requests/',
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
    
    upVote: function(favorID){
      return $http({
        method: 'POST',
        url: 'http://drakeapp.herokuapp.com/api/requests/upVote',
        data: favorID
      })
      .then(function(resp){
        console.log(resp);
      })
    },
    downVote: function(favorID){
      return $http({
        method: 'POST',
        url: 'http://drakeapp.herokuapp.com/api/requests/downVote',
        data: favorID
      })
      .then(function(resp){
        console.log(resp);
      })
      
    },
    
    selectedFavor: null,

    setFavor: function(request) {
      this.selectedFavor = request;
    }
  }
});
