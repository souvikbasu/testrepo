var UserHomePage = function() {
    browser.get('/#/user/');

    this.zonesHeader = element(by.css('.movable-navigation'));
    this.zones = element.all(by.repeater('zone in zones'));
};

module.exports = UserHomePage;
