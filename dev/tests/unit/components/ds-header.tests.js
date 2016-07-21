describe('Component: ds-header', function() {
    var component, $componentController;

    beforeEach(module('cls'));


    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));


    it('should create component', function() {
        component = $componentController('dsHeader',
            null,
            {}
        );
        expect(Object.keys(component).length).toEqual(0);
    });
});
