# Companion Learning Space
Frontend app for CLS using AngularJS

## Install dependencies
    cd dev
    npm install
    gem install scss_lint
        (You need Ruby installed on your system)
    npm install -g bower
    cd client
        (run all bower commands from dev/client folder)
    bower install


## Run the app
Install `serve` npm package [link](https://www.npmjs.com/package/serve)

    cd dev
        (run all npm commands from dev folder)
    npm install -g serve

Build application (development build)
    
    cd dev
        (run all gulp commands from dev folder)
    npm install -g gulp
    gulp

Build application (production build)

    gulp --prod

*Note:* `--prod` argument minimizes and concatenates js and css files. Use only for production deployment

To run app
    Open a new Bash command on Dev folder
    cd deploy
    
    Start the server
    serve -p 4000

    Run the site
    http://localhost:4000

## Testing

### Unit tests

To run all unit tests in `tests/unit` folder

    npm install -g karma-cli
    (Run this once only to install cli tool for karma)
    
    npm test
    (This is a blocking command that keeps watching for all changes to source and test file and reruns tests on any 
    change)
    
    npm run test-single-run
    (This will run the unit tests only once)
    
### End to End tests

### Prerequisite

Install [protractor](http://angular.github.io/protractor/#/)

    npm install -g protractor

This will install two command line tools, `protractor` and `webdriver-manager`. Try running `protractor --version` to make sure it's working.

The `webdriver-manager` is a helper tool to easily get an instance of a Selenium Server running. Use it to download the necessary binaries with:


    webdriver-manager update

To run all e2e tests in `tests/e2e` folder

1.Build and start the server

    cd dev
    gulp
    
    (on a separate console)
    cd ..
    cd deploy
    serve -p 4000


2.To run e2e tests

    cd dev
    npm run test-e2e-dev

3.To run e2e tests in IE you need to manually start web driver

    webdriver-manager update
    (This is one time)

    webdriver-manager start
    (Run this in separate command line window as it will not exit)
    
    npm run test-e2e-ie

    Go through the following blog to setup IE with Protected mode off
 
    
    
# Player

    run WampServer from Start menu
    open CMD in Admin mode
        go to folder where TomcatBuild folder \apache-tomcat-8.0.30-windows-x64\apache-tomcat-8.0.30\bin
        run startup.bat
    open in browser: http://localhost:81/CompanionPlayer/DemoWorkspace/index.html