angular.module('drakeApp.navfact', [])
.factory('Nav', function ($http, $location){

  return {

    navBar: false,

    setBar: function() {
      this.navBar = !this.navBar;
    }

  }

});
