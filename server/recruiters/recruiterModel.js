//Uses dotenv to get process.env variables
require('dotenv').config();
var connectStr = process.env.DATABASE_URL;

var pg = require('pg');

module.exports = {
  getAllJobs: function(req, res) {
    var results = [];
    //Postgress clien from connection pool
    pg.defaults.ssl = true;
    pg.connect(connectStr, function(err, client, done) {
      //Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.send('failed');
      }
      //SQL query, select data
      var query = client.query("SELECT * FROM jobs");

      //Stream results back one row at a time
      query.on('row', function(row) {
        results.push(row);
      });
      //Close connection & return results after all data is received
      query.on('end', function() {
        done();
        return res.json(results);
      });
    });
  },

  signup: function (req, res) {

    // check if user exists
      //return error
    // save info into database

    pg.defaults.ssl = true;

    var data = {
      username: req.body.username,
      password: req.body.password,
      companyName: req.body.companyName,
      email: req.body.email
    };

    pg.connect(connectStr, function(err, client, done) {

      if(err) {
        done();
        console.log('Whoopsie! Error: ', err);
        return res.send('Nope!!');
      }

      var query = "INSERT INTO recruiters (name, username, password, email) values ($1, $2, $3, $4) RETURNING id";

      client.query(query, [data.companyName, data.username, data.password, data.email], function(err, result) {
        if(err) {
          console.log("Nope! You signed up incorrectly Mr(s). Recruiter! Error: ", err.detail);
          return res.json(err);
        } else {
          client.end();
          return res.json(result.rows[0]);
        }
      });

    });

    // var found = false;

    // var query = client.query("SELECT username FROM recruiters WHERE username = " + recruiter.username + ";");

    // if(query) {
      
    // }



  }
};
