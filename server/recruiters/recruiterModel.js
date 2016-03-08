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

  createRecruiterAccount: function(req, res) {

    // check if user exists
      //return error
    // save info into database

    pg.connect(connectStr, function(err,))

    var found = false;

    var query = client.query("SELECT username FROM recruiters WHERE username = " + recruiter.username + ";");

    if(query) {
      
    }



  }
};
