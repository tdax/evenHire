angular.module('evenhire.appLogin', [])

  .controller('AppLoginController', ['$scope', '$state', '$http', 'Applicant', '$window', 'Auth','ngDialog', function ($scope, $state, $http, Applicant, $window, Auth, ngDialog) {

    $scope.user = {};
    $scope.logIn = function() {
      //send form data to the server at api/applicants/signup
      Auth.login($scope.user, 'applicant')
        .then(function(data) {
          //if user is not authenticated
          if (data.status === 400) {
            console.log('error! ', data.data);
          } else {
            $window.localStorage.setItem('evenhire', data.token);
            $state.go('allJobs');
          }
        });
    };
    $scope.closeDialog = function () {
      ngDialog.close();
    };

    $scope.forgotPassword = function() {
      ngDialog.open({
        template: './components/applicants/appLogin/appLogin.tmpl.html',
        controller: 'AppLoginController',
        className: 'ngdialog-theme-default',
        closeByDocument: false,
        scope: $scope
      });
    };

    $scope.sendEmail = function(loggedInUser, currentUserType) {
      Auth.forgotPassword(loggedInUser, currentUserType)
      .then(function() {
        console.log('inside')
      })
    };

}]);







