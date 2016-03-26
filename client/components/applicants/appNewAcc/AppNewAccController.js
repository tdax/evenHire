angular.module('evenhire.appNewAcc', [])

  .controller('AppNewAccController', ['$scope', '$state','$http','Applicant','$window', 'Auth', 'Home',  function ($scope, $state, $http, Applicant, $window, Auth, Home) {
    $scope.message = '';
    $scope.applicant = {};
    $scope.states = Home.states;
    $scope.resumeCheck = false;

    $scope.createAccount = function() {
      if ($scope.applicant.resume.match($scope.applicant.firstName) || $scope.applicant.resume.match($scope.applicant.lastName)) {
      $scope.resumeCheck = true;
      } else {
        Auth.signUp($scope.applicant, 'applicant')
        .then(function(data) {
          if (!data.type) {
            $scope.message = 'Username already exists';
          } else {
            $window.localStorage.setItem('evenhire', data.token);
            $state.go('allJobs');
          }
        });
      };
    };
  }])

  .directive('valueMatches', ['$parse', function ($parse) {
    return {
      require: 'ngModel',
        link: function (scope, elm, attrs, ngModel) {
          var originalModel = $parse(attrs.valueMatches),
              secondModel = $parse(attrs.ngModel);
          // Watch for changes to this input
          scope.$watch(attrs.ngModel, function (newValue) {
            ngModel.$setValidity(attrs.name, newValue === originalModel(scope));
          });
          // Watch for changes to the value-matches model's value
          scope.$watch(attrs.valueMatches, function (newValue) {
            ngModel.$setValidity(attrs.name, newValue === secondModel(scope));
          });
        }
    };
 }]);
