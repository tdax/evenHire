angular.module('evenhire.recruiters.factory', [])
  .factory('Recruiter', ['$http', 'Auth', function($http, Auth) {
    var recruiter = {};

    recruiter.contacted = function(contacted, jobId, applicantId) {
      return $http({
        method: 'POST',
        url: 'api/recruiter/contacted',
        data: {
          contacted: contacted,
          jobId: jobId,
          applicantIdNum: applicantId
        }
      })
      .then(function(data) {
        return data.data;
      }, function(err) {
        return err;
      });
    };

    recruiter.getApplicants = function(jobId) {
      return $http({
        method: 'POST',
        url: 'api/recruiter/getApplicants',
        data: {jobId: jobId}
      })
      .then (function(data) {
        return data.data;
      }, function(err) {
        return err;
      });
    };

    recruiter.getPostedJobs = function() {
      return $http({
        method: 'GET',
        url: 'api/recruiter/allPostedJobs'
      })
      .then(function(data) {
        //data.data is an object with an array of job objects and an array of applicant counts
        return data.data;
      }, function(err) {
        return err;
      });
    };

    recruiter.isInterested = function(isInterested, jobId, applicantId) {
      return $http({
        method: 'POST',
        url: 'api/recruiter/isInterested',
        data: {
          isInterested: isInterested,
          jobId: jobId,
          applicantIdNum: applicantId
        }
      })
      .then(function(data) {
        return data.data;
      }, function(err) {
        return err;
      });
    };

    recruiter.postNewJob = function(newJobObj) {
      return $http({
        method: 'POST',
        url: 'api/recruiter/newJob',
        data: newJobObj
      })
      .then(function(data) {
        return data.data;
      }, function(err) {
        return err;
      });
    };

    recruiter.sendEmail = function(applicantEmail, jobTitle, company, email, message) {
      return $http({
        method: 'POST',
        url: 'api/recruiter/sendEmail',
        data: {
          applicantEmail: applicantEmail,
          jobTitle: jobTitle,
          company: company,
          email: email,
          message: message
        }
      })
      .then(function(data) {
        return data.data;
      }, function(err) {
        return err;
      });
    };

    return recruiter;
  }])
