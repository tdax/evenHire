//Controller for authentication, used in header
angular.module('evenhire.auth', [])

  .controller('AuthController', ['$scope','$state', 'Auth', 'Home', '$stateParams', '$window', function($scope, $state, Auth, Home, $stateParams, $window) {
    $scope.states = Home.states;
    $scope.resetPassword = {};

    Auth.fetchUserFromJwt();
    $scope.logOut = function() {
      Auth.signOut();
      $state.go('home');
      console.log('signed out');
    };

    $scope.getUser = function() {
      console.log('current user is: ', Auth.getCurrentUser());
      console.log('current user type is: ', Auth.getCurrentUserType());
    };

    $scope.updatePassword = function() {
      Auth.updatePassword($scope.resetPassword, $stateParams)
        .then(function(data) {
          if (data.type) {
            $window.localStorage.setItem('evenhire', data.token);
            if (data.userType === 'applicant') {
              $state.go('allJobs');
            } else if (data.userType === 'recruiter') {
              $state.go('recruiters');
            }
          } else {
            console.log('err :', data);
          }
        })
    };
}]);
