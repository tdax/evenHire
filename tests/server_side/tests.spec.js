process.env.NODE_ENV = 'test';
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../index.js');
var testDb = require('../../server/db/db.js').db;
var models = require('../../server/db/models.js');
// var api = request('http://localhost:8000');
var testApplicantToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDYsInVzZXJUeXBlIjoiQXBwbGljYW50In0.v_UCG-HE2hpbnYxpU89rYpyfBeihmxqqyC_o-qn4jq0";
var testRecruiterToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlclR5cGUiOiJyZWNydWl0ZXIifQ.dfNJOjA6OHzF4fG4I7vmkbL5HUdlg67CEaPPR-_BSE4";

before(function(done) {
  models(testDb);
  testDb.sync({force: true})
    .then(function() {
      done();
    });
});

describe('Routes', function() {
  describe('General routes', function() {
    it('GET / should return html and 200', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, done);
    });
  });
});
describe('Recruiters', function() {
  it('GET /api/recruiter/showJobsAppsDB should return 200', function(done) {
    request(app)
      .get('/api/recruiter/showJobsAppsDB')
      .expect(200, done());
  });
  it('POST /api/recruiter/signup should return an object with data and type', function(done) {
    var data = {
      username: 'test',
      password: 'test',
      name: 'test',
      email: 'test'
    };
    request(app)
      .post('/api/recruiter/signup')
      .send(data)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('type');
        expect(res.body).to.have.property('token');
        expect(res.body.type).to.be.true;
        expect(res.body.token).to.be.a('string');
        expect(res.body.token).to.have.length.above(10);
        done();
      });
  });
  describe('Login POST to /api/recruiter/login', function() {
    it('should return an error for a nonexistent user', function(done) {
      var user = {
        username: null,
        password: null
      };
      request(app)
        .post('/api/recruiter/login')
        .send(user)
        .expect(400)
        .end(function(err, res) {
          expect(res.error).to.exist;
          expect(res.error.text).to.equal('User does not exist');
          done();
        });
    });
    it('should return an error with a wrong password', function(done) {
      var data = {
        username: 'test',
        password: 'notTest'
      };
      request(app)
        .post('/api/recruiter/login')
        .send(data)
        .expect(400)
        .end(function(err, res) {
          expect(res.error.text).to.equal('Password does not match');
          done();
        });
    });
    it('Should return a user object, token and true when using correct credentials', function(done) {
      var data = {
        username: 'test',
        password: 'test'
      };
      request(app)
        .post('/api/recruiter/login')
        .send(data)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('type');
          expect(res.body.type).to.be.true;
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data.username).to.be.a('string');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.have.length.above(20);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });
  });
});

describe('Jobs', function(done) {
  describe('Posting a job POST /api/recruiter/newJob', function() {
    var job = {
      title: 'test',
      city: 'San Francisco'
    };
    it('should return a successful job posting with a correct token', function(done) {
      request(app)
        .post('/api/recruiter/newJob')
        .set('x-access-token', testRecruiterToken)
        .send(job)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.id).to.be.equal(1);
          expect(res.body.title).to.be.equal('test');
          expect(res.body.city).to.be.equal('San Francisco');
          expect(res.error).to.be.false;
          done();
        });
    });
    it('should return an error when posting without being logged in', function(done) {
      request(app)
        .post('/api/recruiter/newJob')
        .send(job)
        .expect(400)
        .end(function(err, res) {
          expect(res.error).to.exist;
          done();
        });
    });
  });

  it('should return jobs', function(done) {
    request(app)
      .get('/api/applicant/allJobs')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(Array.isArray(res.body)).to.be.true;
        // expect(res.body).to.have.length.above(0);
        // expect(res.body[0]).to.have.property('title');
        // expect(res.body[0]).to.have.property('city');
        // expect(res.body[0]).to.have.property('recruiterId');
        // expect(res.body[0].recruiter).to.have.property('id');
        done();
      });
  });

  it('should return jobs with a recruiter object', function(done) {
    request(app)
      .get('/api/applicant/allJobs')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(Array.isArray(res.body)).to.be.true;
        // expect(res.body[0]).to.have.property('recruiterId');
        // expect(res.body[0].recruiter).to.be.an('object');
        // expect(res.body[0].recruiter).to.have.property('id');
        done();
      });
  });
});

describe('Applicants', function() {
  describe('Signing up POST /api/applicant/signup', function() {
    it('should return an object with type and data', function(done) {
      var data = {
        firstName: 'test',
        lastName: 'test',
        username: 'test',
        password: {new: 'test'},
        anon_id: 'test',
        email: 'test',
        workExp: 'test',
        education: 'test',
        city: 'test',
        state: 'test',
        resume: 'test'
      };
      request(app)
        .post('/api/applicant/signup')
        .send(data)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('type');
          expect(res.body.type).to.be.true;
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.have.length.above(10);
          done();
        });
    });
  });

  describe('Login POST to /api/applicant/login', function() {
    it('should return an error for a nonexistent user', function(done) {
      var user = {
        username: null,
        password: null
      };
      request(app)
        .post('/api/applicant/login')
        .send(user)
        .expect(400)
        .end(function(err, res) {
          expect(res.error).to.exist;
          expect(res.error.text).to.equal('User does not exist');
          done();
        });
    });
    it('should return a user object, token and true when using correct credentials', function(done) {
      var data = {
        username: 'test',
        password: 'test'
      };
      request(app)
        .post('/api/applicant/login')
        .send(data)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('type');
          expect(res.body.type).to.be.true;
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('username');
          expect(res.body.data.username).to.be.a('string');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.have.length.above(20);
          expect(res.body.token).to.be.a('string');
          done();
        });
    });

    it('should return an error when using a wrong password', function(done) {
      var data = {
        username: 'test',
        password: 'notTest'
      };
      request(app)
        .post('/api/applicant/login')
        .send(data)
        .expect(400)
        .end(function(err, res) {
          expect(res.error).to.exist;
          expect(res.error.text).to.equal('Password does not match');
          done();
        });
    });
  });

  describe('Applying for jobs', function() {
    xit('Should not allow to apply for same job', function(done) {
      request(app)
        .post('/api/applicant/apply')
        .set('x-access-token', testApplicantToken)
        .send({job_id: 1})
        .end(function(err, res) {
          expect(res.body).to.exist;
          // expect(res.body).to.have.property('id');
          done();
        });
    });
  });
});
