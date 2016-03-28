describe('RecNewAccController', function(){

  var $scope;
  var httpBackend;
  var $state;
  var Recruiter;
  var $controller;
  var $window;
  var Auth;

  //load module
  beforeEach(module('evenhire'));
  //inject services for testing
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    $state = $injector.get('$state');
    Recruiter = $injector.get('Recruiter');
    $controller = $injector.get('$controller');
    $scope = $rootScope.$new();
    $window = $injector.get('$window');
    Auth = $injector.get('Auth');

    createController = function() {
      return $controller('RecNewAccController', {
        $scope: $scope,
        $state: $state,
        Recruiter: Recruiter,
        Auth: Auth,
        $window: $window
      });
    };

      httpBackend.whenGET('api/recruiter/getPostedJobs').respond(200, {data: ['job1', 'job2', 'job3']});
      httpBackend.whenGET('components/home/homeView.html').respond('<div>mock template</div>');
      createController();

  }));

  afterEach(function() {
    httpBackend.flush();
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('Creation of Recruiter Account', function() {
    it('should have a createRecAcc', function() {
      expect($scope.createRecAcc).to.exist;
    });
  });

});