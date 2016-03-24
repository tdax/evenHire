angular.module('evenhire.recruiters', ['duScroll'])

.controller('RecHomeController', ['$scope', '$state', 'Recruiter', 'Auth','$mdDialog','ngDialog', 'Home', '$document', function($scope, $state, Recruiter, Auth, $mdDialog, ngDialog, Home, $document) {
  $scope.newJob = {};
  // $scope.currentJobId = '';
  $scope.applicantsToView = [];
  //Info about logged in recruiter
  var currentUser = Auth.getCurrentUser();
  $scope.companyName = currentUser.name;
  $scope.companyEmail = currentUser.email;

  // If true, button is disabled
  $scope.first = false;
  $scope.last = false;

  // $scope.applicantToContact = {};
  $scope.contactMessage = 'We\'d like to schedule an interview. \n\n- ' + $scope.companyName;

  //Options for drop down select when posting a job
  $scope.states = Home.states;
  $scope.careerLevels = Home.careerLevels;
  $scope.jobTypes = Home.jobTypes;
  $scope.industries = Home.industries;

  $scope.selectJobPrompt = true;

  $scope.closeDialog = function() {
    ngDialog.close();
  };

  $scope.contactApplicantModal = function(applicantIndex) {
    if (applicantIndex === 0) {
      $scope.first = true;
      console.log('first one', $scope.first);
    } else if (applicantIndex === $scope.applicantsToView.length - 1) {
      $scope.last = true;
      console.log('last one', $scope.last);
    }
    $scope.applicantIndex = applicantIndex;
    $scope.emailOfApplicantToContact = $scope.applicantsToView[applicantIndex].email;
    $scope.interestedApplicant = $scope.applicantsToView[applicantIndex];
    ngDialog.open({
      template: './components/recruiters/recHome/contactDialog.tmpl.html',
      controller: 'RecHomeController',
      className: 'ngdialog-theme-default',
      preCloseCallback: function(value){
        return $scope.getApplicants($scope.job.jobId, $scope.job.jobObj);
      },
      preserveFocus: false,
      closeByDocument: true,
      scope: $scope
    });
  };

  $scope.contacted = function(applicantId) {
    console.log("applicantId in contacted in RecHomeController", applicantId)
    Recruiter.contacted(true, $scope.currentJob.id, applicantId)
      .then(function(response) {
        console.log("response from Recruiter.contacted", response);
      });
  };

  $scope.getApplicants = function(jobId, jobObj) {
    $scope.selectJobPrompt = false;
    $scope.job = {
      jobId: jobId,
      jobObj: jobObj
    };
      Recruiter.grabApplicants(jobId)
      .then(function(data) {
        $scope.applicantsToView = data;
        $scope.currentJob = jobObj;
      }, function() {
        $scope.error = 'Unable to get applicants';
      });
  };
  //Gets all posted jobs, invoked when state is loaded
  $scope.getJobs = function() {
    Recruiter.getPostedJobs()
      .then(function(data) {
      //sorting jobs by most recent, so need to reverse count array to match
      data.applicantCount.reverse();
      data.results.reverse();
      $scope.postedJobs = data;
    }, function() {
      $scope.error = 'Unable to fetch jobs';
    });
  }();

  $scope.isInterested = function(isInterested, applicantId) {
    Recruiter.isInterested(isInterested, $scope.currentJob.id, applicantId)
      .then(function(response) {
        console.log(response);
        $scope.closeDialog();
      });
  };

  $scope.newJobModal = function() {
    ngDialog.open({
      template: './components/recruiters/recHome/newJobDialog.tmpl.html',
      controller: 'RecHomeController',
      className: 'ngdialog-theme-default',
    });
  };

  $scope.postJob = function() {
    Recruiter.postNewJob($scope.newJob)
      .then(function(newJob) {
        $state.reload();
        console.log('new job is', newJob);
      })
  };

  $scope.sendEmail = function(applicantId) {
    var email = $scope.emailOfApplicantToContact;
    var jobTitle = $scope.currentJob.title;
    console.log("email, jobTitle in sendEmail in RecHomeController", email, jobTitle)
    Recruiter.sendEmail(email, jobTitle, $scope.companyName, $scope.companyEmail, $scope.contactMessage)
      .then(function(response) {
        $scope.message = "Sent email";
        $scope.contacted(applicantId);
        console.log(response);
        $scope.closeDialog();
      });
  };

  $scope.previousApplicant = function(applicantIndex, jobId, job) {
    Recruiter.grabApplicants($scope.job.jobId)
    .then(function(applicants) {
      if ($scope.applicantIndex > 0) {
        if ($scope.applicantIndex === 1 ) {
          $scope.first = true;
        } else {
          $scope.first = false;
        }
          $scope.last = false;
        $scope.interestedApplicant = applicants[--$scope.applicantIndex];
        console.log('====interestedApplicant=====', $scope.interestedApplicant)
        console.log('applicantIndex', $scope.applicantIndex)
      } else if ($scope.applicantIndex === 0) {
        $scope.first = true;
      }
    });
  };

  $scope.nextApplicant = function(interestedApplicant) {
    Recruiter.grabApplicants($scope.job.jobId)
      .then(function(applicants) {
        if ($scope.applicantIndex < applicants.length - 1) {
          if ($scope.applicantIndex === applicants.length - 2) {
            $scope.last = true;
          } else {
            $scope.last = false;
          }
            $scope.first = false;
          $scope.interestedApplicant = applicants[++$scope.applicantIndex];
          console.log('====interestedApplicant=====', $scope.interestedApplicant)
          console.log('applicantIndex', $scope.applicantIndex)
        }
    });
  };

  $scope.scrollToTop = function() {
    $document.scrollTopAnimated(200, 750);
  };
}]);

