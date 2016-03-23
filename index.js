require('dotenv').config();
//Node configuration goes here
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
module.exports = app;
//every request to our server will pass through app.use
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client')));

//middleware deals with applicant and recruiter login routes
require('./server/middleware.js')(app, express);

var port = process.env.PORT || 8000;

app.listen(port, function() {
  console.log('EvenHire running on port ' + port);
});

