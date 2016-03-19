angular.module('evenhire.recruiters', [])

.controller('RecHomeController', ['$scope', '$state', 'Recruiter', 'Auth','$mdDialog','ngDialog', 'Home', function($scope, $state, Recruiter, Auth, $mdDialog, ngDialog, Home) {
  $scope.newJob = {};
  // $scope.currentJobId = '';
  $scope.applicantsToView = [];
  //Info about logged in recruiter
  var currentUser = Auth.getCurrentUser();
  $scope.companyName = currentUser.name;
  $scope.companyEmail = currentUser.email;

  // $scope.applicantToContact = {};
  $scope.contactMessage = 'We\'d like to schedule an interview. \n\n- ' + $scope.companyName;

  //Options for drop down select when posting a job
  $scope.states = Home.states;
  $scope.careerLevels = Home.careerLevels;
  $scope.jobTypes = Home.jobTypes;
  $scope.industries = Home.industries;


  $scope.newJobModal = function() {
    ngDialog.open({
      template: './components/recruiters/recHome/newJobDialog.tmpl.html',
      controller: 'RecHomeController',
      className: 'ngdialog-theme-default',
    });
  };
  $scope.closeDialog = function() {
    ngDialog.close();
  };

  $scope.contactApplicantModal = function(applicantIndex) {
    $scope.emailOfApplicantToContact = $scope.applicantsToView[applicantIndex]['who'].email;
    $scope.interestedApplicant = $scope.applicantsToView[applicantIndex]['who'];
    ngDialog.open({
      template: './components/recruiters/recHome/contactDialog.tmpl.html',
      controller: 'RecHomeController',
      className: 'ngdialog-theme-default',
      scope: $scope
    });
  };

  $scope.getApplicants = function(jobId, jobObj) {
    Recruiter.grabApplicants(jobId)
      .then(function(data) {
        Recruiter.grabInterested(jobId)
          .then(function(interested) {
            $scope.currentJob = jobObj;
            for(var i = 0; i < data.length; i++) {
              for(var j = 0; j < interested.length; j++) {
                if(data[i].id === interested[j].applicantId) {
                  if(interested[j].isInterested === true) {
                    $scope.applicantsToView.push({who: data[i], interesting: 'interesting'});
                  }
                  if(interested[j].isInterested === false) {
                    $scope.applicantsToView.push({who: data[i], interesting: 'uninteresting'});
                  }
                  if(interested[j].isInterested === null) {
                    $scope.applicantsToView.push({who: data[i], interesting: 'neutral'});
                  }
                }
              }
            }
            // setCSS();
            console.log('WOOOOOOOOOO: ', $scope.applicantsToView);
            console.log('');
          }, function() {
            $scope.error = 'Unable to grab stuff';
          });
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
      $scope.error = 'Unable to fetch jobs';
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
    var email = $scope.emailOfApplicantToContact;
    var jobTitle = $scope.currentJob.title;
    Recruiter.sendEmail(email, jobTitle, $scope.companyName, $scope.companyEmail, $scope.contactMessage)
      .then(function(response) {
        $scope.message = "Sent email";
        console.log(response);
        $scope.closeDialog();
      });
  };

  $scope.isInterested = function(applicantId) {
    Recruiter.isInterested(true, $scope.currentJob.id, applicantId)
      .then(function(response) {
        console.log(response);
      });
  };

  $scope.isNotInterested = function(applicantId) {
    Recruiter.isInterested(false, $scope.currentJob.id, applicantId)
      .then(function(response) {
        console.log(response);
      });
  };

}]);
