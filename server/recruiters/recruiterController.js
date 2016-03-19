var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

//Require our database instance with its models
var db = require('../db/db').db;
var Models = require('../db/models')(db);
var authUtils = require('../auth/utils');

module.exports = {
  getAllJobs: function(req, res) {
    var decoded = authUtils.decodeToken(req.headers['x-access-token']);
    var requestorId = decoded.id;
    var applicantCount = [];
    Models.Job.findAll({where: {recruiterId: requestorId}})
      .then(function(results) {
        //add applicant count to each job
        for (var i = 0; i < results.length; i++) {
        // var job = results[0]
          results[i].countApplicants()
            .then(function(count) {
              applicantCount.push(count);
              if (applicantCount.length === results.length) {
                return res.send({'results': results, 'applicantCount': applicantCount});
              }
            })
            .catch(function(err) {
              console.log('Error in counting applicants');
            });
        }
      })
      .catch(function(err) {
        return res.send(err);
      });
  },

  getAllRecs: function(req, res) {
    Models.Recruiter.findAll()
      .then(function(results) {
        return res.send(results);
      })
      .catch(function(err) {
        return res.send(err);
      });
  },

  getApplicants: function(req, res) {
    Models.Job.findById(req.body.jobId)
      .then(function(job) {
        job.getApplicants({joinTableAttributes: ['isInterested']})
          .then(function(applicants) {
            res.send(applicants);
          })
          .catch(function(err) {
            console.log('Error in finding applicants', err);
            res.send(err);
          });
      })
      .catch(function(error) {
        res.send(error);
      });
  },

  getJobAppRelations: function(req, res) {
    Models.JobApplicant.findAll()
      .then(function(results) {
        return res.send(results);
      })
      .catch(function(err) {
        return res.send(err);
      });
  },

  login: function(req, res) {
    Models.Recruiter.findOne({ where: {username: req.body.username }})
      .then(function(recruiter) {
        recruiter.verifyPassword(req.body.password, function(err, isVerified) {
          //Error in verifying
          if (err) {
            console.log('error in recruiterController');
            return res.send({
              type: false,
              data: 'Error occured: ' + err
            });
          }
          if (!(isVerified)) {
            return res.send({
              type: false,
              data: 'Wrong password'
            });
          } else {
            var token = authUtils.issueToken(recruiter.id, 'recruiter');
            console.log("Signin successful");
            return res.send({
              type: true,
              token: token,
              data: recruiter
            });
          }
        });
      })
      .catch(function(error) {
        console.log('This user does not exist')
        return res.send({
          type: false,
          data: 'User does not exist'
        });
      });
  },

  postJob: function(req, res) {
    if (!req.headers['x-access-token']) {
      return res.status(500).send('Not logged in');
    }
    var decoded = authUtils.decodeToken(req.headers['x-access-token']);
    var requestorId = decoded.id;
    Models.Recruiter.findById(requestorId)
      .then(function(recruiter) {
        recruiter.createJob({
          title: req.body.title,
          city: req.body.city,
          state: req.body.state,
          zipcode: req.body.zipcode,
          description: req.body.description,
          industry: req.body.industry,
          career_level: req.body.career_level,
          job_type: req.body.job_type,
          qualifications: req.body.qualifications,
        })
        .then(function(newJob) {
          return res.send(newJob);
        });
      })
    .catch(function(err) {
      return res.send(err);
    });
  },

  sendEmail: function(req, res) {
    var email = {
      from: req.body.company + ' <' + req.body.email + ' >',
      to: req.body.applicantEmail,
      subject: req.body.jobTitle + ' position for ' + req.body.company,
      text: req.body.message
    };
    console.log('email we want to send is: ', email);
    console.log('testing to see if our process.env.mailgundomain works: ', process.env.MAILGUN_DOMAIN);
    mailgun.messages().send(email, function(error, body) {
      console.log('resonse from mail gun is, ', body);
      res.send(body);
    });
  },

  signup: function(req, res) {
    if (!req.body.name || !req.body.username) {
      return res.send({
        type: false,
        data: null
      });
    }
    var newUser = Models.Recruiter.build({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    })
      .setPassword(req.body.password, function(updated) {
        updated.save()
          .then(function() {
            var token = authUtils.issueToken(updated.id, 'recruiter');
            return res.send({
              data: updated,
              type: true,
              token: token
            });
          })
          .catch(function(error) {
            return res.send({
              type: false,
              data: error
            });
          });
      });
  },

  isInterested: function(req, res) {
    var job = req.body.jobId;
    var applicant = req.body.applicantIdNum;
    var interested = req.body.isInterested;
    Models.JobApplicant.findOne({where: {applicantId: applicant, jobId: job}})
      .then(function(found) {
        found.update({
          isInterested: interested
        })
        .then(function(inserted) {
          res.status(200).send(inserted);
        });
      })
      .catch(function(err) {
        console.log('Err: ', err);
        return res.status().send(err);
      })
  }

};

// [Sequelize.fn(Sequelize.col('results.dataValues.applicantId'))]
