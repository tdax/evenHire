//Uses dotenv to get process.env variables
// Database url for testing:
var connectStrForTesting = process.env.DEV_DATABASE_URL;
var connectStr = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  connectStr = connectStrForTesting;
}

//NOTE- travis unable to read process.env.DATABASE_URL, throws an error
var Sequelize = require('sequelize');

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
module.exports.sequelize = Sequelize;

