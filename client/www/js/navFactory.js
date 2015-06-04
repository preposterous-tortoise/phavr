angular.module('phavr.navfact', [])
.factory('Nav', function ($http, $location){

  return {

    navBar: true,

    setBar: function(bool) {
      this.navBar = bool;
    }

  }

});
