var token_secret = process.env.JWT_SECRET;
var jwt = require('jwt-simple');


module.exports = {
  issueToken: function(id, userType) {
    var payload = {
      id: id,
      userType: userType
    };
    return jwt.encode(payload, token_secret);
  },
  decodeToken: function(token) {
    return jwt.decode(token, token_secret);
  },
  capitalize: function(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
};
