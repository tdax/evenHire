module.exports = function(config) {
    'use strict';
    var configuration = {
        basePath: '',

        frameworks: ['mocha', 'chai'],

        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-ui-router/release/angular-ui-router.min.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/ng-dialog/js/ngDialog.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/sinon-chai/lib/sinon-chai.js',
            'node_modules/sinon/pkg/sinon.js',

            //client files with tests in each folder respectively
            'client/app.js',
            'client/auth/*.js',
            'client/components/**/*.js',
            'tests/client_side/**/*.js'
        ],

        //test results reporters to use
        reporters: ['progress', 'mocha'],

        client: {
          mocha: {
            reporter: 'html',
            ui: 'bdd'
          }
        },

        port: 9876,

        //enables colors on the output of reporters and logs
        colors: true,

        //watches files and executes tests whenever they change
        autoWatch: true,

        //if true, Karma captures browser, runs, then exits
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ['Chrome'],

        customLaunchers: {
          ChromeTravisCi: {
            base: 'Chrome',
            flags: ['--no-sandbox']
          }
        }

    };
    if (process.env.TRAVIS) {
      configuration.browsers = ['ChromeTravisCi'];
    }
    config.set(configuration)
};
