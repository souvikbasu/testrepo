describe('Behavior: focus-on', function() {
    var element, scope, $timeout, $compile;

    beforeEach(module('cls'));


    beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
        $timeout = _$timeout_;
    }));


    it('should add class focused on element if the attribute is bound to a truthy expression', function() {
        scope.showFocus = true;
        element = $compile('<input focus-on="showFocus" />')(scope);
        scope.$digest();
        $timeout.flush();
        expect(element.hasClass('focused')).toBeTruthy();
    });


    it('should not add class focused on element if the attribute is bound to a falsy expression', function() {
        scope.showFocus = false;
        element = $compile('<input focus-on="showFocus" />')(scope);
        scope.$digest();
        $timeout.flush();
        expect(element.hasClass('focused')).toBeFalsy();
    });


    it('should add class focused on element if the attribute is changed from falsy to a truthy expression', function() {
        scope.showFocus = false;
        element = $compile('<input focus-on="showFocus" />')(scope);
        scope.$digest();
        $timeout.flush();
        expect(element.hasClass('focused')).toBeFalsy();

        scope.showFocus = true;
        scope.$digest();
        $timeout.flush();
        expect(element.hasClass('focused')).toBeTruthy();
    });


    it('should not add class focused on element if the attribute is changed from truthy to a falsy expression',
        function() {
            scope.showFocus = true;
            element = $compile('<input focus-on="showFocus" />')(scope);
            scope.$digest();
            $timeout.flush();
            expect(element.hasClass('focused')).toBeTruthy();

            scope.showFocus = false;
            scope.$digest();
            $timeout.flush();
            expect(element.hasClass('focused')).toBeFalsy();
        });
});
