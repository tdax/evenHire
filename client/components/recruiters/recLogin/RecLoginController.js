angular.module('evenhire.recLogin', [])

  .controller('RecLoginController', ['$scope','$state', '$http', 'Recruiter', '$window', 'Auth', function($scope, $state, $http, Recruiter, $window, Auth) {
    $scope.user = {};
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
}]);
