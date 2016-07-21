describe('Component: cls-footer', function() {
    var component, $componentController;

    beforeEach(module('cls'));


    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));


    it('should set ds tnc', function() {
        component = $componentController('clsFooter',
            null,
            {termsofuse: 'ds-tnc'}
        );
        expect(component.tnc).toBe('http://ds-tnc');
    });


    it('should set public tnc', function() {
        component = $componentController('clsFooter',
            null,
            {termsofuse: 'public-tnc'}
        );
        expect(component.tnc).toBe('http://public-tnc');
    });


    it('should not set tnc is value other than ds or public tnc', function() {
        component = $componentController('clsFooter',
            null,
            {termsofuse: 'abc'}
        );
        expect(component.tnc).toBe('');
    });
});
