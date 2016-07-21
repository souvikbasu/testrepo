describe('Component: public-search-card', function() {
    var component, $state, $componentController, $rootScope, scope;

    beforeEach(module('cls'));

    beforeEach(inject(function(_$componentController_, _$rootScope_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $componentController = _$componentController_;
    }));

    it('should assign the bindings to courseid, title, versions, langs', function() {
        component = $componentController('publicSearchCard', null, {
            courseid: '9427',
            title: 'ABC',
            versions: [{
                id: 1,
                nm: '2015x'
            }],
            langs: [{
                id: 'en',
                nm: 'English'
            }]
        });
        expect(component.courseid).toBe('9427');
        expect(component.title).toBe('ABC');
        expect(component.versions[0].nm).toBe('2015x');
        expect(component.langs[0].nm).toBe('English');
    });

    it('should open version dropdown and close the language dropdown if open', function() {
        component = $componentController('publicSearchCard', null, {
            versions: [{}],
            langs: [{}]
        });

        component.openVerDropdown = false;
        component.openLangDropdown = true;
        component.versionDropdownOpen();

        expect(component.openVerDropdown).toEqual(true);
        expect(component.openLangDropdown).toEqual(false);
    });

    it('should open language dropdown and close the version dropdown if open', function() {
        component = $componentController('publicSearchCard', null, {
            versions: [{}],
            langs: [{}]
        });

        component.openVerDropdown = true;
        component.openLangDropdown = false;
        component.languageDropdownOpen();

        expect(component.openVerDropdown).toEqual(false);
        expect(component.openLangDropdown).toEqual(true);
    });

    describe('Set parameter object and redirect to course details page', function() {
        beforeEach(inject(function(_$state_) {
            $state = _$state_;
        }));

        it('should set language property and redirect to course metadata page', function() {
            spyOn($state, 'go');
            component = $componentController('publicSearchCard', null, {
                courseid: '9427',
                versions: [{}],
                langs: [{}]
            });

            var courseObj = {
                lang: 'en',
                lId: component.courseId
            };
            component.courseDetails(courseObj);
            expect($state.go).toHaveBeenCalled();
        });
    });
});
