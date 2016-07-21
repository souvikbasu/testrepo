var browsers = {
        firefox: {
            name: 'Firefox',
            browserName: 'firefox'
        },
        chrome: {
            name: 'Chrome',
            browserName: 'chrome'
        },
        ie: {
            name: 'Internet Explorer',
            browserName: 'internet explorer',
            platform: 'ANY',
            version: '11'
        },
        ios: {
            name: 'iOS 7 - iPad',
            platformName: 'iOS',
            platformVersion: '8.2',
            deviceName: 'iPad Simulator',
            browserName: 'Safari',
            orientation: 'landscape'
        }
    },
    config = {
        specs: [
            './e2e/**/*.spec.js'
        ],
        baseUrl: 'http://localhost:4000',
        allScriptsTimeout: 45000,
        onPrepare: function() {
            var SpecReporter = require('jasmine-spec-reporter');
            // add jasmine spec reporter
            jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
        },
        jasmineNodeOpts: {
            print: function() {
            }
        }
    };

if (process.argv[3] === '--firefox') {
    config.capabilities = browsers.firefox;
} else if (process.argv[3] === '--chrome') {
    config.capabilities = browsers.chrome;
} else if (process.argv[3] === '--ie') {
    config.seleniumAddress = 'http://ie11.dev:4444/wd/hub';
    config.capabilities = browsers.ie;
} else if (process.argv[3] === '--ios') {
    config.seleniumAddress = 'http://ie11.dev:4444/wd/hub';
    config.capabilities = browsers.ios;
} else {
    config.multiCapabilities = [
        browsers.firefox,
        browsers.chrome,
        browsers.ie
    ];
}

exports.config = config;
