var Recruiter = require('./recruiterController');

module.exports = function (router) {
  //Get all posted jobs for a given recruiterId
  router.get('/allPostedJobs', Recruiter.getAllJobs);
  //Get list of applicants who've applied to particular job
  router.post('/getApplicants', Recruiter.getApplicants);
  //Allow recruiters to login to the site
  router.post('/login', Recruiter.login);
  //Email an applicant to schedule an interview
  router.post('/sendEmail', Recruiter.sendEmail);
  //Allow recruiters to sign up
  router.post('/signup', Recruiter.signup);
  //Post a new job to the site
  router.post('/newJob', Recruiter.postJob);
  //To view recruiters db table, visit /api/recruiters/showRecruitersDB
  router.get('/showRecruitersDB', Recruiter.getAllRecs);
  //To view jobs_applicants db table, visit /api/recruiters/showJobsAppsDB
  router.get('/showJobsAppsDB', Recruiter.getJobAppRelations);
  //To know if a recruiter is interested in a particular applicant
  router.post('/isInterested', Recruiter.isInterested);
};
