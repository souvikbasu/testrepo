describe('Page: Home', function() {
    beforeEach(module('cls'));

    var $controller, courseService;

    beforeEach(inject(function(_$controller_, _courseService_) {
        $controller = _$controller_;
        courseService = _courseService_;
    }));


    describe('I18n', function() {
        var $scope, controller;
        beforeEach(function() {
            $scope = {};
            controller = $controller('HomeCtrl', {$scope: $scope});
        });

        it('should check for languages supported as English and Japanese', function() {
            expect($scope.supportedLocales.length).toBe(2);
            expect($scope.supportedLocales[0].display).toBe('English');
            expect($scope.supportedLocales[0].lang).toBe('en');
            expect($scope.supportedLocales[1].display).toBe('Japanese');
            expect($scope.supportedLocales[1].lang).toBe('jp');
        });
    });

    describe('Product and Industry list', function() {
        var $scope, createController, fakePromise, productAndIndustryListSpy;

        beforeEach(inject(function($q) {
            fakePromise = $q.when();
        }));

        beforeEach(function() {
            $scope = {};
            createController = function() {
                return $controller('HomeCtrl', {$scope: $scope, courseService: courseService});
            };

            productAndIndustryListSpy = spyOn(courseService, 'getProductAndIndustryCategoryList').and
                .returnValue(fakePromise);
        });

        it('should get an instance of courseService', function() {
            expect(courseService).toBeDefined();
        });

        it('should have called courseService method getProductAndIndustryCategoryList', function() {
            createController();
            expect(productAndIndustryListSpy).toHaveBeenCalled();
        });
    });
});
