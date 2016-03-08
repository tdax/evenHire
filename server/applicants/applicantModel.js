//Uses dotenv to get process.env variables
require('dotenv').config();
var connectStr = process.env.DATABASE_URL;

var pg = require('pg');

module.exports = {
  signup: function(req, res) {
    //Postgress clien from connection pool
    pg.defaults.ssl = true;
    pg.connect(connectStr, function(err, client, done) {
      //Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.send('failed');
      }
      //need to create a anon_id still
      var query = "INSERT INTO applicants (first_name, last_name, username, password, anon_id, email, work_exp, education, city) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, anon_id";
      client.query(query, [req.body.firstName, req.body.lastName, req.body.username, req.body.password, 'need to make anon_id', req.body.email, req.body.workExp, req.body.education, req.body.city], function(err, result) {
        if(err) {
          console.log("error on applicant signup", err);
          return res.json(err);
        } else {
          client.end();
          return res.json(result.rows[0])
        }
      });
    });
  },

  getAllJobs: function(req, res) {
    var results = [];
    pg.defaults.ssl = true;
    pg.connect(connectStr, function(err, client, done) {

      var query = client.query("SELECT title FROM jobs");

      query.on('row', function(row) {
        results.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(results);
      });
    });
  },

  submitApplication: function(req, res) {
    pg.defaults.ssl = true;
    pg.connect(connectStr, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.send('failed');
      }

      //need to create anon_id and change values
      var query = "INSERT INTO jobs_applicants (jobs_id, applicants_id) VALUES ($1, $2)";
      client.query(query, [req.body.jobs_id, req.body.applicants_id], function(err, result) {
        if(err) {
          console.log("error on submitApplication" , err.detail);
          return res.json(err);
        }
          return res.json(result.rowCount);
      });
    });
  }
};