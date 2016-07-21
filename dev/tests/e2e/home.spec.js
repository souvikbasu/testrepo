var HomePage = require('./pages/home-page.js');

function setup(device) {
    var width = 1920,
        height = 1040;

    switch (device) {
        case 'desktop':
            width = 990;
            height = 768;
            break;
        case 'tablet':
            width = 768;
            height = 1024;
            break;
        case 'mobile':
            width = 320;
            height = 568;
            break;
        default:
            return;
    }

    browser.driver.manage().window().setSize(width, height);
}

describe('Home page', function() {
    var homePage;

    beforeEach(function() {
        homePage = new HomePage();
    });


    describe('For all devices', function() {
        ['desktop', 'tablet', 'mobile'].forEach(function(d) {
            (function(device) {
                it('[' + device + '] should display the correct title', function() {
                    setup(device);
                    expect(browser.getTitle()).toBe('Dassault Companion');
                });

                it('[' + device + '] should contain all explore sections', function() {
                    setup(device);
                    expect(homePage.searchBox.isDisplayed());

                    expect(homePage.exploreByIndusry.isDisplayed());
                    homePage.industryList.then(function(result) {
                        expect(result.length).toBeGreaterThan(1);
                        expect(result.length).toEqual(15);
                    });

                    var visible = homePage.industryList
                        .filter(function(item) {
                            return item.isDisplayed();
                        });
                    visible.then(function(result) {
                        expect(result.length).toEqual(15);
                    });

                    expect(homePage.exploreByProduct.isDisplayed());

                    homePage.productList.then(function(result) {
                        expect(result.length).toBeGreaterThan(1);
                        expect(result.length).toEqual(12);
                    });

                    visible = homePage.productList
                        .filter(function(item) {
                            return item.isDisplayed();
                        });
                    visible.then(function(result) {
                        expect(result.length).toEqual(12);
                    });
                });

                it('[' + device + '] should search for courses in search box', function() {
                    setup(device);
                    homePage.searchBox.sendKeys('CATIA');
                    expect(homePage.searchResult.count()).toBeGreaterThan(200);
                    expect(homePage.searchResult.get(0).getText())
                        .toEqual('VS-CATIA Imagine and Shape Essentials Quiz-2013x');

                    homePage.searchBox.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE,
                        protractor.Key.BACK_SPACE,
                        protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
                    expect(homePage.searchResult.count()).toEqual(0);
                });

                it('[' + device + '] should scroll down to explore by industry', function() {
                    setup(device);
                    browser.executeScript('return window.pageYOffset;')
                        .then(function(initialWindowTop) {
                            expect(initialWindowTop).toEqual(0);
                        });

                    homePage.exploreByIndusryBtn.click()
                        .then(function() {
                            browser.executeScript('return window.pageYOffset;')
                                .then(function(newWindowTop) {
                                    homePage.exploreByIndusry.getLocation()
                                        .then(function(divPosition) {
                                            expect(divPosition.y).toEqual(newWindowTop);
                                        });
                                });
                        });
                });
            })(d);
        });
    });


    describe('For desktop', function() {
        (function(device) {
            it('[' + device + '] should scroll down to explore by product', function() {
                setup(device);
                browser.executeScript('return window.pageYOffset;')
                    .then(function(initialWindowTop) {
                        expect(initialWindowTop).toEqual(0);
                    });

                homePage.exploreByProductBtn.click()
                    .then(function() {
                        browser.executeScript('return window.pageYOffset;')
                            .then(function() {
                                homePage.exploreByProduct.getLocation()
                                    .then(function(divPosition) {
                                        expect(divPosition.y).toEqual(1286);
                                    });
                            });
                    });
            });
        })('desktop');
    });


    describe('For tablet', function() {
        (function(device) {
            it('[' + device + '] should scroll down to explore by product', function() {
                setup(device);
                browser.executeScript('return window.pageYOffset;')
                    .then(function(initialWindowTop) {
                        expect(initialWindowTop).toBeLessThan(400);
                    });

                homePage.exploreByProductBtn.click()
                    .then(function() {
                        browser.executeScript('return window.pageYOffset;')
                            .then(function() {
                                homePage.exploreByProduct.getLocation()
                                    .then(function(divPosition) {
                                        expect(divPosition.y).toEqual(1034);
                                    });
                            });
                    });
            });
        })('tablet');
    });


    describe('For mobile', function() {
        (function(device) {
            it('[' + device + '] should scroll down to explore by product', function() {
                setup(device);
                browser.executeScript('return window.pageYOffset;')
                    .then(function(initialWindowTop) {
                        expect(initialWindowTop).toBeLessThan(400);
                    });

                homePage.exploreByProductBtn.click()
                    .then(function() {
                        browser.executeScript('return window.pageYOffset;')
                            .then(function() {
                                homePage.exploreByProduct.getLocation()
                                    .then(function(divPosition) {
                                        expect(divPosition.y).toBeGreaterThan(1000);
                                    });
                            });
                    });
            });
        })('mobile');
    });
});
