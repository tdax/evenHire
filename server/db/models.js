//Use datatypes of Sequelize to define property types
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

module.exports = function(db) {
  var Recruiter = db.define('recruiters', {
    name: Sequelize.STRING,
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: Sequelize.STRING,
    email: Sequelize.STRING
  }, {
    //for deleting
    paranoid: true,
    instanceMethods: {
      setPassword: function(password, done) {
        //generate a salt
        var that = this;
        return bcrypt.genSalt(10, function(err, salt) {

          return bcrypt.hash(password, salt, function(error, encrypted) {
            //save encrypted password along with the salt
            that.password = encrypted;
            that.salt = salt;
            done(that);
          });
        });
      },
      verifyPassword: function(password, done) {
        return bcrypt.compare(password, this.password, function(err, result) {
          //result is a boolean
          return done(err, result);
        });
      }
    }
  });

  var Applicant = db.define('applicants', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: Sequelize.STRING,
    anon_id: Sequelize.STRING,
    email: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    work_exp: Sequelize.TEXT,
    education: Sequelize.TEXT,
    resume: Sequelize.TEXT
  }, {
    //for deleting
    paranoid: true,
    instanceMethods: {
      setPassword: function(password, done) {
        //generate a salt
        var that = this;
        return bcrypt.genSalt(10, function(err, salt) {

          return bcrypt.hash(password, salt, function(error, encrypted) {
            //save encrypted password along with the salt
            that.password = encrypted;
            that.salt = salt;
            done(that);
          });
        });
      },
      verifyPassword: function(password, done) {
        return bcrypt.compare(password, this.password, function(err, result) {
          //result is a boolean
          return done(err, result);
        });
      }
    }
  });

  var Job = db.define('jobs', {
    title: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    zipcode: Sequelize.STRING,
    description: Sequelize.TEXT,
    industry: Sequelize.STRING,
    career_level: Sequelize.STRING,
    job_type: Sequelize.STRING,
    qualifications: Sequelize.TEXT
    //sequelize automatically creates a createdAt property
  });

  var JobApplicant = db.define('jobs_applicants', {
    isInterested: {type: Sequelize.BOOLEAN, defaultValue: null},
    contacted: {type: Sequelize.BOOLEAN, defaultValue: false}
  });

  //set up one to many relationship
  Recruiter.hasMany(Job);
  Job.belongsTo(Recruiter);
  //set up many to many relationship
  Job.belongsToMany(Applicant, {through: 'jobs_applicants'});
  Applicant.belongsToMany(Job, {through: 'jobs_applicants'});

  //WARNING! to sync and possibly clear db uncomment this line:
  //db.sync({force: true});

  return {
    Job: Job,
    Applicant: Applicant,
    Recruiter: Recruiter,
    JobApplicant: JobApplicant
  }
};
