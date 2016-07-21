var UserHomePage = require('./pages/user-home-page.js');

describe('User Home page', function() {
    var userHomePage;

    beforeEach(function() {
        userHomePage = new UserHomePage();
    });


    it('should display the correct title', function() {
        expect(browser.getTitle()).toBe('Dassault Companion');
    });

    it('should contain all visible zones in header', function() {
        expect(userHomePage.zonesHeader.isDisplayed());
        userHomePage.zones.then(function(result) {
            expect(result.length).toEqual(12);
        });

        var visible = userHomePage.zones
            .filter(function(item) {
                return item.isDisplayed();
            });
        visible.then(function(result) {
            expect(result.length).toEqual(12);
        });
    });
});
