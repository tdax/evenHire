angular.module('evenhire.recruiters', [])

.controller('RecHomeController', ['$scope', '$state', 'Recruiter', 'Auth','$mdDialog','ngDialog', 'Home', function ($scope, $state, Recruiter, Auth, $mdDialog, ngDialog, Home) {
  $scope.newJob = {};
  $scope.JobApplicant = {};
  // $scope.error;
  var currentUser = Auth.getCurrentUser();
  $scope.companyName = currentUser.name;
  $scope.contactMessage = 'We\'d like to schedule an interview!';
  $scope.companyEmail = currentUser.email;
  $scope.states = Home.states;
  $scope.careerLevels = Home.careerLevels;
  $scope.jobTypes = Home.jobTypes;
  $scope.industries = Home.industries;

  $scope.clickToOpen = function () {
    ngDialog.open({
      template: './components/recruiters/recHome/newJobDialog.tmpl.html',
      controller: 'RecHomeController',
      className: 'ngdialog-theme-default',
    });
  };
  $scope.closeDialog = function () {
    ngDialog.close();
  };

  $scope.clickToOpenContact = function (applicantIndex, jobIndex) {
    $scope.jobToContactAbout = $scope.postedJobs.results[jobIndex].title;
    var jobId = $scope.postedJobs.results[jobIndex].id;
    $scope.applicantToContact = $scope.JobApplicant[jobId][applicantIndex].email;
    ngDialog.open({
      template: './components/recruiters/recHome/contactDialog.tmpl.html',
      controller: 'RecHomeController',
      className: 'ngdialog-theme-default',
      scope: $scope
    });
  };

  $scope.getApplicants = function(jobId) {
    Recruiter.grabApplicants(jobId)
      .then(function(data) {
        console.log(data);
        $scope.JobApplicant[jobId] = data;
      }, function() {
        $scope.error = 'Unable to get applicants';
      });
  };

  $scope.getJobs = function() {
    Recruiter.getPostedJobs()
      .then(function(data) {
      //sorting jobs by most recent, so need to reverse count array to match
      data.applicantCount.reverse();
      data.results.reverse();
      $scope.postedJobs = data;
    }, function() {
      $scope.error = 'unable to get jobs';
    });
  }();

  $scope.postJob = function() {
    Recruiter.postNewJob($scope.newJob)
      .then(function(newJob) {
        $state.reload();
        console.log('new job is', newJob);
      })
  };

  $scope.sendEmail = function() {
    Recruiter.sendEmail($scope.applicantToContact, $scope.jobToContactAbout, $scope.companyName, $scope.companyEmail, $scope.contactMessage)
      .then(function(response) {
        console.log(response);
        $scope.closeDialog();
      });
  };
}]);
