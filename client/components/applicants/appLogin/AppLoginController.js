angular.module('evenhire.appLogin', [])

  .controller('AppLoginController', ['$scope', '$state', '$http', 'Applicant', '$window', 'Auth','ngDialog', function($scope, $state, $http, Applicant, $window, Auth, ngDialog) {
    $scope.message = '';
    $scope.user = {};
    $scope.logIn = function() {
      //send form data to the server at api/applicants/signup
      Auth.login($scope.user, 'applicant')
        .then(function(data) {
          //if user is not authenticated
          if (data.status === 400) {
            $scope.message = data.data;
            console.log('error! ', data.data);
          } else {
            $window.localStorage.setItem('evenhire', data.token);
            $state.go('allJobs');
          }
        });
    };
    $scope.closeDialog = function() {
      ngDialog.close();
    };

    $scope.forgotPassword = function() {
      ngDialog.open({
        template: './components/applicants/appLogin/appForgetPassword.tmpl.html',
        controller: 'AppLoginController',
        className: 'ngdialog-theme-default',
        closeByDocument: true,
        scope: $scope
      });
    };

    $scope.sendEmail = function(loggedInUser, currentUserType) {
      // console.log(loggedInUser, currentUserType);
      Auth.forgotPassword(loggedInUser, currentUserType)
      .then(function(data) {
        console.log(data.body.message);
      })
    $scope.closeDialog();
    };

}]);







