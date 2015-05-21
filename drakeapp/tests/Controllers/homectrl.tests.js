describe('homeCtrl', function() {
  var scope;

  beforeEach(module('drakeApp.home'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('homeCtrl', {$scope: scope});
  }));

  it('should have testVar set to true', function() {
    expect(scope.testVar).toEqual(true);
  });
});
