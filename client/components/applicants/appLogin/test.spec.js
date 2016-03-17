describe("A test suite", function() {
   beforeEach(function() { });
   afterEach(function() { });
   it('should pass', function() { expect(false).to.be.false; });
});

describe('AppLoginController', function() {
  var $scope;
  var httpBackend;
  var $state;
  var Applicant;
  var $controller;
  var Auth;

  beforeEach(module('evenhire'));
  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    $state = $injector.get('$state');
    Applicant = $injector.get('Applicant');
    Auth = $injector.get('Auth');
    $controller = $injector.get('$controller');
    $scope = $rootScope.$new();

    createController = function() {
      return $controller('AppLoginController', {
        $scope: $scope,
        $state: $state,
        Applicant: Applicant,
        Auth: Auth
      });
    };
    createController();
  }));

  // afterEach(function() {
  //   httpBackend.flush();
  //   httpBackend.verifyNoOutstandingExpectation();
  //   httpBackend.verifyNoOutstandingRequest();
  // });
  describe('the logIn function', function () {
    it('should be defined', function() {
      expect($scope.logIn).to.exist;
    });
  });
  describe('the forgot password function', function () {
    it('should be defined', function() {
      expect($scope.forgotPassword).to.exist;
    });
  });

});
