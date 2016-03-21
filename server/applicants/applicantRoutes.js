var Applicant = require('./applicantController');

module.exports = function(router) {
  router.post('/login', Applicant.login);
  router.post('/signup', Applicant.signup);
  router.get('/allJobs', Applicant.getAllJobs);
  router.post('/apply', Applicant.submitApplication);
  //To view jobs db, visit /api/applicant/showJobsDB
  router.get('/showJobsDB', Applicant.getAllJobs);
  //To view applicants db, visit /api/applicant/showApplicantsDB
  router.get('/showApplicantsDB', Applicant.getAllApplicants);
  //To update applicants profile
  router.post('/userUpdate', Applicant.userUpdate);
};
