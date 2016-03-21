var db = require('../db/db').db;
var Models = require('../db/models')(db);
var authUtils = require('./utils');
var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

module.exports = function(app) {
  //Takes jwt token and returns user type and user object
  app.post('/fetch', function(req, res) {
    var decoded = authUtils.decodeToken(req.body.jwt);
    //need to change userType to capital to match our sequelize database table schema
    var userType = decoded.userType.charAt(0).toUpperCase() + decoded.userType.slice(1);
    Models[userType].findOne({ where: {id: decoded.id }})
      .then(function(user) {
        res.send({
          userType: decoded.userType,
          user: user.dataValues
        });
      })
      .catch(function(err) {
        console.log('error in authController.js', err);
        return res.send(err)
      });
  });

  app.post('/resetPassword', function(req, res) {
    var decoded = authUtils.decodeToken(req.body.token);
    var userType = authUtils.capitalize(decoded.userType);
    Models[userType].findById(decoded.id)
    .then(function(user) {
      user.setPassword(req.body.newPassword, function(updated) {
        updated.save()
        .then(function() {
          return res.send({
            token: req.body.token,
            type: true,
            data: updated,
            userType: decoded.userType
          });
        })
        .catch(function(error) {
          return res.send({
            type: false,
            data: 'Error in updating your password'
          });
        });
      });
    })
    .catch(function(err) {
      return res.send({
        type: false,
        data: 'No account found'
      });
    });
  });

  app.post('/forgotPassword', function(req, res) {
    var userType = req.body.userType;
    var userEmail = req.body.userData.email;
    if (userType === 'applicant') {
      console.log('looking for applicant', userEmail);
      Models.Applicant.findOne({ where: {email: userEmail }})
        .then(function(applicant) {
          var token = authUtils.issueToken(applicant.id, 'applicant');
          console.log('token is:', token);
          console.log('applicant is:', applicant.password)
          var email = {
            from: 'Even Hire' + ' < evenhire@gmail.com >',
            to: userEmail,
            subject: 'Reset Password',
            html: 'Dear ' + applicant.first_name + ',<br><br>We are sending this email because we received a request from you to change your password. If you did not make this request, please ignore this email. To change your password, click the link below.<br><br><a href="evenhire.herokuapp.com/#/resetPassword/' + token + '">Update Password</a><br/><br>Once you change your password,  be sure to keep it secure. Never reveal your password to anyone, and never respond to an email asking for your password information.<br><br><br>The Even Hire Team'
          };
          mailgun.messages().send(email, function(error, body) {
            console.log('error in applicantcontroller sending email is, ', error);
            console.log('the body response is', body);
            res.send({error: error, body: body});
          });
        })
        .catch(function(err) {
          return res.send(err);
        });
    } else {
      console.log('looking for recruiter', req.body.userData.email);
      var userEmail = req.body.userData.email;
      Models.Recruiter.findOne({where: {email: userEmail}})
      .then(function(recruiter) {
        var token = authUtils.issueToken(recruiter.id, 'recruiter');
        console.log('token is:', token);
        console.log('recruiter is:', recruiter.password)
        var email = {
          from: 'Even Hire' + ' < evenhire@gmail.com >',
          to: userEmail,
          subject: 'Reset Password',
          html: 'Dear ' + recruiter.name + ',<br><br>We are sending this email because we received a request from you to change your password. If you did not make this request, please ignore this email. To change your password, click the link below.<br><br><a href="evenhire.herokuapp.com/#/resetPassword/' + token + '">Update Password</a><br/><br>Once you change your password,  be sure to keep it secure. Never reveal your password to anyone, and never respond to an email asking for your password information.<br><br><br>The Even Hire Team'
        };
        mailgun.messages().send(email, function(error, body) {
          console.log('error in recrutercontroller sending email is, ', error);
          console.log('the body response is', body);
          res.send({error: error, body: body});
        });
      })
      .catch(function(err) {
        return res.send(err);
      });
    }
  });
};
