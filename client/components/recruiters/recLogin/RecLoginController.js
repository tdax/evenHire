angular.module('evenhire.recLogin', [])

  .controller('RecLoginController', ['$scope','$state', '$http', 'Recruiter', '$window', 'Auth', 'ngDialog', function($scope, $state, $http, Recruiter, $window, Auth, ngDialog) {
    $scope.user = {};

    $scope.closeDialog = function() {
      ngDialog.close();
    };

    $scope.logIn = function() {
      Auth.login($scope.user, 'recruiter')
      .then(function(data) {
        if (!(data.type)) {
          console.log('error!', data.data);
        } else {
          $window.localStorage.setItem('evenhire', data.token);
          $state.go('recruiters');
        }
      });
    };

    $scope.forgotPassword = function() {
      ngDialog.open({
        template: './components/recruiters/recLogin/recForgetPassword.tmpl.html',
        controller: 'RecLoginController',
        className: 'ngdialog-theme-default',
        closeByDocument: false,
        scope: $scope
      });
    };

    $scope.sendEmail = function(recoveredUser, currentUserType) {
      // console.log(recoveredUser, currentUserType);
      Auth.forgotPassword(recoveredUser, currentUserType)
      .then(function(data) {
        console.log(data.body.message);
      })
      $scope.closeDialog();
    };

}]);
