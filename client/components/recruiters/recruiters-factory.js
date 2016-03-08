angular.module('evenhire.recruiters.factory', [])
  .factory('Recruiter', ['$http', function($http) {
    var recruiter = {};

    recruiter.signup = function(newUser) {
      return $http({
        method: 'POST',
        url: 'api/recruiters/signup',
        data: newUser
      })
      .then(function(data){
        console.log(data);
        return data.data;
      }, function(err) {
        console.log("nopstradamous!", err);
      });
    };

    recruiter.login = function(user){
      return $http({
        method: 'POST',
        url: 'api/recruiters/login',
        data: user
      })
      .then(function(data){
        console.log(data);
      }, function(err) {
        console.log(err);
      });
    };

    recruiter.getPostedJobs = function() {
      return $http({
        method: 'GET',
        url: 'api/recruiters/allPostedJobs',
      })
      .then(function(data) {
        //data.data is an array of objects
        console.log(data.data);
        return data.data;
      }, function(err) {
        console.log('error in getting all posted jobs');
      });
    }

    recruiter.postNewJob = function(newJobObject) {
      return $http({
        method: 'POST',
        url: 'api/recruiters/newJob',
        data: newJobObject
      })
      .then(function(data) {
        console.log(data)
      }, function(err) {
        console.log('error in posting new job');
      });
    }

    return recruiter;
  }])
