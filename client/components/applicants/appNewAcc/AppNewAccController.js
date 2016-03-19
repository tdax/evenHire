angular.module('evenhire.appNewAcc', [])

  .controller('AppNewAccController', ['$scope', '$state','$http','Applicant','$window', 'Auth', 'Home', function ($scope, $state, $http, Applicant, $window, Auth, Home) {

    $scope.applicant = {};
    $scope.states = Home.states;

    $scope.createAccount = function() {
      //Checking if passwords match
      if($scope.applicant.verify_password === $scope.applicant.password) {
        //send form data to the server at api/applicant/signUp
        Auth.signUp($scope.applicant, 'applicant')
        .then(function(data) {
          if (!data.type) {
            console.log('User already exists', data.data);
          } else {
            $window.localStorage.setItem('evenhire', data.token);
            console.log('NEW USER is :', data);
            $state.go('allJobs');
          }
        });
      } else {
        //Alerting user their passwords don't match
        alert("Your passwords don't match!");
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