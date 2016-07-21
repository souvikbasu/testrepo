describe('Component: search-box', function() {
    var component, $scope, $componentController, courseService, $q, deferred;

    beforeEach(module('cls'));


    beforeEach(inject(function($rootScope, _$componentController_,  _$q_, _courseService_) {
        $scope = $rootScope.$new();
        $componentController = _$componentController_;
        courseService = _courseService_;
        $q = _$q_;
        deferred = _$q_.defer();
    }));


    it('should assign the name bindings to placeholder and searchtext', function() {
        component = $componentController('searchBox',
            null,
            {
                placeholder: 'Search Something',
                searchtext: 'Search This!!'
            }
        );
        expect(component.placeholder).toBe('Search Something');
        expect(component.searchtext).toBe('Search This!!');
    });


    it('should get an instance of courseService', function() {
        expect(courseService).toBeDefined();
    });


    it('should not search if search text is empty', function() {
        component = $componentController('searchBox',
            null,
            {
                searchtext: '',
                courseService: courseService
            }
        );
        component.onSearchTextChange();
        expect(component.searchResult).toEqual([]);
    });


    it('should get search results', function() {
        spyOn(courseService, 'searchFromCourseList').and.returnValue(deferred.promise);
        component = $componentController('searchBox',
            null,
            {
                searchtext: 'ABC',
                courseService: courseService
            }
        );
        component.onSearchTextChange();
        deferred.resolve([
            {
                lObjLock: true,
                lObjTit: 'CATIA Generative Shape Design V5R18 Update',
                lObjId: 21
            },
            {
                lObjLock: true,
                lObjTit: 'CATIA Mechanical Design V5R18 Update',
                lObjId: 22
            }
        ]);
        $scope.$apply();
        expect(component.searchResult).not.toBe(undefined);
        expect(component.searchResult.length).toBe(2);
        expect(component.searchResult[1].lObjTit).toBe('CATIA Mechanical Design V5R18 Update');
    });
});
