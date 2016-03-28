describe('The Auth Controller', function(){
    var $window;
    var $scope;
    var Auth;
    var $state;
    var httpBackend;
    var Home;
    var $stateParams;
    //load module
    beforeEach(module('evenhire'));
    //inject services for testing, we use _ before and after so we can have our var name be the same as the injected service
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        httpBackend = $injector.get('$httpBackend');
        Auth = $injector.get('Auth');
        Home = $injector.get('Home');
        $state = $injector.get('$state');
        $window = $injector.get('$window');
        $controller = $injector.get('$controller');
        $stateParams = $injector.get('$stateParams');
        $scope = $rootScope.$new();

        createController = function() {
            return $controller('AuthController', {
                $scope: $scope,
                $state: $state,
                Auth: Auth,
                Home: Home,
                $stateParams: $stateParams,
                $window: $window
            });
        };

        httpBackend.whenPOST('/api/applicant/userUpdate').respond(200, {data: {data: {
              type: true,
              data: {id:1}
          }}});
        httpBackend.whenPOST('/api/auth/fetch').respond(200, {data: 'test'});
        httpBackend.whenGET('components/home/homeView.html').respond('<div>mock template</div>');
      createController();
    }));

    beforeEach(function() {
        Auth.signOut()
    });

    afterEach(function() {
        httpBackend.flush();
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe('should have a logout function', function () {
        it('should be defined', function () {
            expect($scope.logOut).to.not.be.undefined;
        });
        it('should call the factory logOut function', function() {
            // var spy = sinon.spy(Auth.signOut);
            // $scope.logOut();
            // expect(spy).to.have.been.called;
        });

        describe('the factory signout function', function () {
          it('should be defined', function () {
              expect(Auth.signOut).to.not.be.undefined;
          });
          it('should signout the current user', function() {
            Auth.setUser({id:1}, 'applicant');
            $window.localStorage.setItem('evenhire', 'test');
            $scope.logOut();
            var userType = Auth.getCurrentUserType();
            var user = Auth.getCurrentUser();
            expect(userType).to.be.null;
            expect(user).to.be.null;
            expect(Auth.getJwt()).to.not.exist;
          })
        });
    });

    describe('should have an update password function', function () {
        it('should be defined', function () {
            expect($scope.updatePassword).to.not.be.undefined;
        });
    });

    describe('fetch user from jwt function', function () {
      it('should be defined', function () {
          expect(Auth.fetchUserFromJwt).to.not.be.undefined;
      });
    });

    describe('forgot password function', function () {
      it('should be defined', function () {
          expect(Auth.forgotPassword).to.not.be.undefined;
      });
    });

    describe('the login function', function () {
      it('should be defined', function () {
          expect(Auth.login).to.not.be.undefined;
      });
    });
    describe('the signUp function', function () {
      it('should be defined', function () {
          expect(Auth.signUp).to.not.be.undefined;
      });
    });
    describe('is authenticated function', function () {
      it('should be defined and return false on default', function () {
          expect(Auth.isAuth).to.not.be.undefined;
          expect(Auth.isAuth()).to.be.false;
      });
      it('should return true with an evenhire token', function() {
        $window.localStorage.setItem('evenhire', 'test');
        expect(Auth.isAuth()).to.be.true;
      })
    });
    describe('set current user function', function () {
      it('should be defined', function () {
          expect(Auth.setUser).to.not.be.undefined;
      });
      it('should set current user and type', function() {
        Auth.setUser({id:2}, 'applicant');
        var user = Auth.getCurrentUser();
        var userType = Auth.getCurrentUserType();
        expect(user).to.be.an('object');
        expect(user.id).to.equal(2);
        expect(userType).to.equal('applicant');
      });
    });

    describe('get current user function', function () {
      it('should be defined and null at start', function () {
          expect(Auth.getCurrentUser).to.not.be.undefined;
          expect(Auth.getCurrentUser()).to.be.null;
      });
      it('should get the correct user object', function() {
          Auth.setUser({id:1}, 'applicant');
          var user = Auth.getCurrentUser();
          expect(user).to.be.an('object');
          expect(user.id).to.equal(1);
      });
    });

    describe('get current user type function', function () {
      it('should be defined', function () {
          expect(Auth.getCurrentUserType).to.not.be.undefined;
          expect(Auth.getCurrentUserType()).to.be.null;
      });
      it('should get the correct user type', function() {
        Auth.setUser({id:1}, 'applicant');
        var userType = Auth.getCurrentUserType();
        expect(userType).to.equal('applicant');
      });
    });

    describe('get jwt token function', function () {
      it('should be defined and return null', function () {
        expect(Auth.getJwt).to.not.be.undefined;
        expect(Auth.getJwt()).to.be.null;
      });
      it('should return a string', function () {
        $window.localStorage.setItem('evenhire', 'test');
        expect(Auth.getJwt()).to.equal('test');
        expect(Auth.getJwt()).to.be.a('string');
      });
    });

    describe('user update function', function () {
      it('should be defined', function () {
          expect(Auth.userUpdate).to.not.be.undefined;
      });

    });

});
