//routes and route configuration
angular.module('evenhire',[
  'evenhire.home',
  'evenhire.allJobs',
  'evenhire.appLogin',
  'evenhire.appNewAcc',
  'evenhire.recruiters',
  'evenhire.recLogin',
  'evenhire.recNewAcc',
  'ui.router',
  'evenhire.applicants.factory',
  'evenhire.recruiters.factory',
  'evenhire.home.factory',
  'ngMaterial',
  'evenhire.auth.factory',
  'evenhire.auth',
  'ngDialog',
  'ngAnimate'
  ])

  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo');
    // .backgroundPalette('grey');
      // .dark();
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'components/home/homeView.html',
        controller: 'HomeController'
      })
      .state('allJobs', {
        url: '/allJobs',
        templateUrl: 'components/applicants/allJobs/allJobsView.html',
        controller: 'AllJobsController'
      })
      .state('appLogin', {
        url: '/appLogin',
        templateUrl: 'components/applicants/appLogin/appLoginView.html',
        controller: 'AppLoginController'
      })
      .state('appNewAcc', {
        url: '/appNewAcc',
        templateUrl: 'components/applicants/appNewAcc/appNewAccView.html',
        controller: 'AppNewAccController'
      })
      .state('recruiters', {
        url: '/recruiters',
        templateUrl: 'components/recruiters/recHome/recHomeView.html',
        controller: 'RecHomeController',
        authenticate: true
      })
      .state('recLogin', {
        url: '/recLogin',
        templateUrl: 'components/recruiters/recLogin/recLoginView.html',
        controller: 'RecLoginController'
      })
      .state('recNewAcc', {
        url: '/recNewAcc',
        templateUrl: 'components/recruiters/recNewAcc/recNewAccView.html',
        controller: 'RecNewAccController'
      })
      .state('resetPassword', {
        url: '/resetPassword/:token',
        templateUrl: 'auth/resetPassword.html',
        controller: 'AuthController'
      });

      $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function($window) {
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('evenhire');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $state, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      //If a logged in applicant tries to access recruiters state, redirect to login
      if (toState && toState.authenticate && Auth.getCurrentUserType() !== 'recruiter') {
        console.log('need to be authenticated');
        event.preventDefault();
        $state.go('recLogin');
      }
    });
  });
