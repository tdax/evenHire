var db = require('../db/db').db;
var Models = require('../db/models')(db);
var authUtils = require('../auth/utils');

module.exports = {
  getAllApplicants: function(req, res) {
    Models.Applicant.findAll()
      .then(function(results) {
        return res.send(results);
      })
      .catch(function(err) {
        return res.send(err);
      });
  },

  getAllJobs: function(req, res) {
    Models.Job.findAll({
      include: [{
        model: Models.Recruiter
      }]
    })
      .then(function(data) {
        return res.send(data);
      })
      .catch(function(err) {
        return res.send(err);
      });
  },

  login: function(req, res) {
    // decoded token can be viewed thru authUtils.decodeToken(req.headers['x-access-token'])
    Models.Applicant.findOne({ where: {username: req.body.username }})
      .then(function(applicant) {
        applicant.verifyPassword(req.body.password, function(err, isVerified) {
          //Wrong password
          if (!(isVerified)) {
            return res.status(400).send('You have entered an invalid username or password');
          }
          //Error in verifying password
          if (err) {
            return res.status(400).send('Error in verifying password');
          }
          var token = authUtils.issueToken(applicant.id, 'applicant');
          console.log('Sign in successful');
          return res.send({
            type: true,
            token: token,
            data: applicant
          });
        });
      })
      .catch(function(error) {
        return res.status(400).send('Username does not exist, please sign up for an account');
      });
  },

  signup: function(req, res) {
    var newUser = Models.Applicant.build({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      password: req.body.password.new,
      anon_id: req.body.anon_id,
      email: req.body.email,
      work_exp: req.body.workExp,
      education: req.body.education,
      city: req.body.city,
      state: req.body.state,
      resume: req.body.resume
    })
      .setPassword(req.body.password.new, function(updated) {
        updated.save()
          .then(function() {
            var token = authUtils.issueToken(updated.id, 'applicant');
            return res.send({
              data: updated,
              type: true,
              token: token
            });
          })
          //if username already exists, send back validation error
          .catch(function(error) {
            return res.send({
              type: false,
              data: error
            });
          });
      });
  },

  submitApplication: function(req, res) {
    // if (!req.headers['x-access-token']) {
    //   return res.status(500).send('Not logged in');
    // }
    var applicantId = authUtils.decodeToken(req.headers['x-access-token']).id;
    Models.Job.findById(req.body.job_id)
      .then(function(job) {
        Models.Applicant.findById(applicantId)
        .then(function(applicant) {
          job.hasApplicant(applicant)
          .then(function(result) {
            if(result) {
              return res.send(!result)
            }
            job.addApplicant(applicant)
              return res.send(applicant)
          })
        });
      })
      .catch(function(err) {
        return res.send(err);
      });
  },

  userUpdate: function(req, res) {
    var applicantId = authUtils.decodeToken(req.headers['x-access-token']).id;
    Models.Applicant.findById(req.body.id)
      .then(function(applicant) {
        applicant.update({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          city: req.body.city,
          work_exp: req.body.work_exp,
          education: req.body.education,
          resume: req.body.resume
         })
        .then(function() {
           console.log('applicant is :', applicant.dataValues);
           return res.send(applicant.dataValues);
        })
        .catch(function(err) {
          return res.send(err);
        });
      });
  }



};
