//Controller for authentication, used in header
angular.module('evenhire.auth', [])

  .controller('AuthController', ['$scope','$state', 'Auth', function($scope, $state, Auth) {
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
}]);
