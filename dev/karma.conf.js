// Karma configuration
// Generated on Wed May 11 2016 11:43:06 GMT+0530 (India Standard Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angulartics/dist/angulartics.min.js',
            'client/bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
            'client/bower_components/angular-translate/angular-translate.min.js',
            'client/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'client/data/env/unit-test-settings.js',
            'client/app/app.constants.js',
            'client/app/cls.module.js',
            'client/app/utility/**.utility.js',
            'client/app/behaviors/**.behavior.js',
            'client/app/decorators/**.decorator.js',
            'client/app/services/**.svc.js',
            'client/app/components/**/*.js',
            'client/app/pages/**/*.js',
            'client/app/cls.config.js',
            'tests/unit/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'client/app/**/*.js': 'coverage'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
        // config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],
        // browsers: ['Chrome', 'Firefox', 'IE'],
        // browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }
    })
};
