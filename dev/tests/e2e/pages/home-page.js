var HomePage = function() {
    browser.get('/');

    this.searchBox = element(by.model('$ctrl.searchtext'));
    this.searchResult = element.all(by.repeater('result in $ctrl.searchResult'));
    this.exploreByIndusryBtn = element(by.id('goto_industry'));
    this.exploreByProductBtn = element(by.id('goto_product'));
    this.exploreByIndusry = element(by.id('explore_by_industry'));
    this.industryList = element.all(by.repeater('industry in data.industries'));
    this.exploreByProduct = element(by.id('explore_by_product'));
    this.productList = element.all(by.repeater('product in data.brands'));
};

module.exports = HomePage;
