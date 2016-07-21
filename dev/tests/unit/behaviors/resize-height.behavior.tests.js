describe('Behavior: resize-height', function() {
    var element, scope, $compile, $window;

    beforeEach(module('cls'));


    beforeEach(inject(function($rootScope, _$compile_, _$window_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
        $window = _$window_;
    }));


    it('should set height of the control to be 50px less than the window height', function() {
        $window.innerHeight = 120;
        element = $compile('<div resize-height />')(scope);
        expect(element.attr('style')).toBe('height: 70px;');
    });

    it('should set retain existing style', function() {
        $window.innerHeight = 120;
        element = $compile('<div style="width:200px;" resize-height />')(scope);
        expect(element.attr('style')).toBe('width:200px;height: 70px;');
    });
});
