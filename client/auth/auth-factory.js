angular.module('evenhire.auth.factory', [])

  .factory('Auth', ['$window', '$http', function($window, $http) {
    var currentUser = null;
    var currentUserType = null;

    var auth = {}

      auth.isAuth = function() {
        return !!window.localStorage.getItem('evenhire');
      };

      auth.fetchUserFromJwt = function(cb) {
        if (auth.isAuth()) {
        var jwtObj = {jwt: auth.getJwt()};
          return $http({
            method: 'POST',
            url: '/api/auth/fetch',
            data: jwtObj
          })
          .then(function(data) {
            var userType = data.data.userType;
            var userObject = data.data.user;
            auth.setUser(userObject, userType);
            if (cb) {
              cb(data.data.user);
            }
          }, function(err) {
            console.log('error in fetching jwt in auth-factory.js', err);
            return err;
          });
        }
      };

      auth.getCurrentUser = function() {
        return currentUser;
      };

      auth.getCurrentUserType = function() {
        return currentUserType;
      };

      auth.getJwt = function() {
        return window.localStorage.getItem('evenhire');
      };

      auth.login = function(userData, userType) {
        return $http({
          method: 'POST',
          url: '/api/' + userType + '/login',
          data: userData
        })
        .then(function(data) {
          console.log('data in authfactory is', data);
          if (data.data.type) {
            auth.setUser(data.data.data, userType);
          }
          return data.data;
        }, function(err) {
          return err;
        });
      };

      auth.setUser = function(user, userType) {
        currentUser = user;
        currentUserType = userType;
      };

      auth.signUp = function(userData, userType) {
        return $http({
          method: 'POST',
          url: 'api/' + userType + '/signup',
          data: userData
        })
        .then(function(data) {
          if (data.data.type) {
            auth.setUser(data.data.data, userType);
          }
          return data.data;
        }, function(response) {
          console.log(response)
        });
      };

      auth.signOut = function() {
        $window.localStorage.removeItem('evenhire');
        currentUser = null;
        currentUserType = null;
      };

      auth.userUpdate = function(userData, userType) {
        return $http({
          method: 'POST',
          url: 'api/' + userType + '/userUpdate',
          data: userData
        })
        .then(function(data) {
          if (data.data.type) {
            auth.setUser(data.data.data, userType);
          }
          return data.data;
        }, function(response) {
          console.log(response)
        });
      };

      auth.forgotPassword = function(userData, userType) {
        return $http({
          method: 'POST',
          url: 'api/auth/forgotPassword',
          data: {
            userData: userData,
            userType: userType
          }
        })
        .then(function(data) {
          console.log('response from server is, ', data);
          return data.data;
        }, function(response) {
          console.log('response from data on error is, ', response)
        });
      };

      auth.updatePassword = function(newPassword, token) {
        return $http({
          method: 'POST',
          url: 'api/auth/resetPassword',
          data: {
            newPassword: newPassword.newPassword,
            token: token.token
          }
        })
        .then(function(data) {
          if (!data.data.type) {
            return data.data.data
          } else {
            auth.setUser(data.data.data, data.data.userType)
            return data.data;
          }
        }, function(err) {
          return err;
        });
      };

    return auth;
  }]);
