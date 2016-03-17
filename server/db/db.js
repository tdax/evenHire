//Uses dotenv to get process.env variables
require('dotenv').config();
var connectStr = process.env.DATABASE_URL;
//NOTE- travis unable to read process.env.DATABASE_URL, throws an error
var Sequelize = require('sequelize');
console.log('====================', process.env.MAILGUN_DOMAIN);

var sequelize = new Sequelize(connectStr, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

sequelize.authenticate()
  .then(function(err) {
  if(err) {
    console.log('cant connect to db', err);
  } else {
    console.log('connected to db')
  }
});
//Export our configured instance of our Heroku db
module.exports.db = sequelize;

