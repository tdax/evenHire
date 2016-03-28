describe('AllJobsController', function(){
  var $scope;
  var httpBackend;
  var $state;
  var Applicant;
  var $controller;
  var Auth;
  var Home;

  //load module
  beforeEach(module('evenhire'));
  //inject services for testing
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    $state = $injector.get('$state');
    Applicant = $injector.get('Applicant');
    Home = $injector.get('Home');
    Auth = $injector.get('Auth');
    $controller = $injector.get('$controller');
    $scope = $rootScope.$new();

    createController = function() {
      return $controller('AllJobsController', {
        $scope: $scope,
        $state: $state,
        Applicant: Applicant,
        Home: Home,
        Auth: Auth
      });
    };

      httpBackend.whenGET('api/applicant/allJobs').respond(200, {data: ['job1', 'job2', 'job3']});
      httpBackend.whenGET('components/home/homeView.html').respond('<div>mock template</div>');
      createController();
  }));

  afterEach(function() {
    httpBackend.flush();
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('should have a submitAplication function', function () {
      it('should be defined', function () {
          expect($scope.submitApplication).to.exist;
      });
      it('apply should be defined in applicant factory', function () {
          expect(Applicant.apply).to.not.be.undefined;
      });
  });

  describe('should have a getAllJobs function', function () {
      it('should be defined', function () {
          expect(typeof $scope.getAllJobs).to.exist;
      });
      it('allJobs should be defined in applicant factory', function () {
          expect(Applicant.allJobs).to.not.be.undefined;
      });
      // it('should fetch jobs', function () {
      //     httpBackend.expectGET('api/applicant/allJobs');
      //     Applicant.allJobs()
      //       .then(function(result) {
      //         expect(result.data).to.have.lengthOf(3);
      //         expect($scope.fetchedJobs.data).to.have.length.above(2);
      //       });
      // });
  });

  describe('fetched jobs', function () {
      it('should be empty', function () {
          expect($scope.fetchedJobs).to.have.lengthOf(0);
      });
  });

});
