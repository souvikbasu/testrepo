(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:HomeCtrl
     * @description Controller for home page. Makes all service calls to
     *              populate home page and react to user inputs
     */
    angular.module('cls').controller(
        'HomeCtrl',
        ['$scope', '$translate', '$location', '$anchorScroll', '$state', '$window', 'appConfig', 'courseService',
            HomeCtrl]);

    function HomeCtrl($scope, $translate, $location, $anchorScroll, $state, $window, appConfig, courseService) {
        $scope.leftSetting = 0;
        $scope.leftSettingProduct = 0;
        $scope.errorText = '';
        $scope.supportedLocales = [
            {
                display: 'English',
                lang: 'en'
            },
            {
                display: 'Japanese',
                lang: 'jp'
            }
        ];
        $scope.minCountIndustry = 0;
        $scope.minCountProduct = 0;

        courseService.getProductAndIndustryCategoryList().then(function(data) {
            $scope.data = data;
        });

        $scope.exploreByIndustry = function() {
            $location.hash('explore_by_industry');
            $anchorScroll();
        };

        $scope.exploreByProduct = function() {
            $location.hash('explore_by_product');
            $anchorScroll();
        };

        $scope.changeLocale = function() {
            $translate.use($scope.locale.lang);
        };

        $scope.searchProduct = function(product) {
            $state.go('publicSearch', {searchObject: product});
        };

        $scope.searchIndustry = function(industry) {
            $state.go('publicSearch', {searchObject: industry});
        };

        $scope.prevIndustry = function() {
            $scope.minCountIndustry = $scope.minCountIndustry - 3;
            $scope.leftSetting += 687;
            $scope.slideCatalog = {left: $scope.leftSetting + 'px'};
        };

        $scope.nextIndustry = function() {
            $scope.minCountIndustry = $scope.minCountIndustry + 3;
            $scope.leftSetting -= 687;
            $scope.slideCatalog = {left: $scope.leftSetting + 'px'};
        };

        $scope.prevIndustryXs = function() {
            $scope.minCountIndustry = $scope.minCountIndustry - 1;
            $scope.leftSetting += 216;
            $scope.slideCatalog = {left: $scope.leftSetting + 'px'};
        };

        $scope.nextIndustryXs = function() {
            $scope.minCountIndustry = $scope.minCountIndustry + 1;
            $scope.leftSetting -= 216;
            $scope.slideCatalog = {left: $scope.leftSetting + 'px'};
        };

        $scope.prevProductXs = function() {
            $scope.minCountProduct = $scope.minCountProduct - 1;
            $scope.leftSettingProduct += 216;
            $scope.slideCatalogProduct = {left: $scope.leftSettingProduct + 'px'};
        };

        $scope.nextProductXs = function() {
            $scope.minCountProduct = $scope.minCountProduct + 1;
            $scope.leftSettingProduct -= 216;
            $scope.slideCatalogProduct = {left: $scope.leftSettingProduct + 'px'};
        };

        $scope.loginDev = function() {
            $state.go('user.dashboard');
        };

        $scope.toggleSelect1 = function() {
            $scope.isPopupVisible = !$scope.isPopupVisible;
        };

        $scope.isPopupVisible = false;

        $scope.toggleSelect = function toggleSelect(popupVisible) {
            $scope.isPopupVisible = popupVisible;
        };
    }
})();
