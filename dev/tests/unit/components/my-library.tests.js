describe('Component: my-library', function() {
    var component, $rootScope, $componentController, scope, $stateParams, appSettingsService, courseService,
        $q, deferredZoneSettings, deferredAssignments, $state;

    beforeEach(module('cls'));


    beforeEach(inject(
        function(_$rootScope_, _$componentController_, _$stateParams_, _$q_, _appSettingsService_, _courseService_) {
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $componentController = _$componentController_;
            $stateParams = _$stateParams_;
            $q = _$q_;
            deferredZoneSettings = _$q_.defer();
            deferredAssignments = _$q_.defer();
            appSettingsService = _appSettingsService_;
            courseService = _courseService_;
        }));


    describe('summary attribute', function() {
        it('should return value of summary', function() {
            component = $componentController('myLibrary',
                null,
                {summary: '1'}
            );
            expect(component.isSummary()).toBeTruthy();

            component = $componentController('myLibrary',
                null,
                {summary: '0'}
            );
            expect(component.isSummary()).toBeFalsy();
        });
    });


    describe('title, description, rows attribute', function() {
        it('should set title, description, rows attribute', function() {
            component = $componentController('myLibrary',
                {$scope: scope},
                {
                    title: 'Old Title',
                    desc: 'Old Description',
                    rows: 2
                }
            );

            expect(component.title).toBe('Old Title');
            expect(component.desc).toBe('Old Description');
            expect(component.rows).toBe(2);
        });


        it('should replace title, description, rows values from stateParam', function() {
            $stateParams.title = 'New Title';
            $stateParams.desc = 'New Description';
            $stateParams.rows = 5;

            component = $componentController('myLibrary',
                {$scope: scope},
                {
                    title: 'Old Title',
                    desc: 'Old Description',
                    rows: 2
                }
            );

            expect(component.title).toBe('New Title');
            expect(component.desc).toBe('New Description');
            expect(component.rows).toBe(5);
        });


        it('should replace title, description, rows values from appSettings only if title is null', function() {
            $stateParams.title = null;
            $stateParams.desc = 'New Description';
            $stateParams.rows = 5;
            spyOn(appSettingsService, 'getZoneSettings').and.returnValue(deferredZoneSettings.promise);

            component = $componentController('myLibrary',
                {$scope: scope},
                {
                    title: null,
                    desc: 'Old Description',
                    rows: 2
                }
            );

            deferredZoneSettings.resolve({
                layPref: [
                    {
                        id: 2,
                        zn: 'Title from app settings service',
                        desc: 'Description from app settings service',
                        nRow: 10
                    }
                ]
            });
            scope.$apply();

            expect(component.title).toBe('Title from app settings service');
            expect(component.desc).toBe('Description from app settings service');
            expect(component.rows).toBe(10);
        });


        it('should replace title, description, rows values from appSettings only if id=2', function() {
            $stateParams.title = null;
            $stateParams.desc = 'New Description';
            $stateParams.rows = 5;
            spyOn(appSettingsService, 'getZoneSettings').and.returnValue(deferredZoneSettings.promise);

            component = $componentController('myLibrary',
                {$scope: scope},
                {
                    title: null,
                    desc: 'Old Description',
                    rows: 2
                }
            );

            deferredZoneSettings.resolve({
                layPref: [
                    {
                        id: 3,
                        zn: 'Title from app settings service',
                        desc: 'Description from app settings service',
                        nRow: 10
                    }
                ]
            });
            scope.$apply();

            expect(component.title).toBe(null);
            expect(component.desc).toBe('Old Description');
            expect(component.rows).toBe(2);
        });
    });


    describe('fetch courses', function() {
        beforeEach(inject(
            function(_$state_) {
                $state = _$state_;
            }));


        it('should redirect to user.library state on click of See All', function() {
            spyOn($state, 'go').and.returnValue(deferredZoneSettings.promise);

            component = $componentController('myLibrary',
                null,
                {
                    title: 'Title',
                    desc: 'Desc'
                }
            );

            component.seeAll();

            expect($state.go).toHaveBeenCalledWith('user.library', {title: 'Title', desc: 'Desc'});
        });


        it('should set course count on receive of broadcast message updateLibraryCount', function() {
            component = $componentController('myLibrary',
                {$scope: scope},
                {}
            );

            expect(component.displayLibraryCount).not.toEqual(50);

            $rootScope.$broadcast('updateLibraryCount', 50);

            expect(component.displayLibraryCount).toEqual(50);
        });

        it('should set course list on receive of broadcast message courseListUpdated', function() {
            component = $componentController('myLibrary',
                {$scope: scope},
                {}
            );
            expect(component.totalCount).not.toEqual(3);

            var courses = [{}, {}, {}];
            $rootScope.$broadcast('courseListUpdated', courses);

            expect(component.totalCount).toEqual(3);
        });

        it('should set course list on receive of emit message courseListUpdated', function() {
            component = $componentController('myLibrary',
                {$scope: scope},
                {}
            );
            expect(component.totalCount).not.toEqual(3);

            var courses = [{}, {}, {}];
            scope.$emit('courseListUpdated', courses);

            expect(component.totalCount).toEqual(3);
        });

        it('should have a method to fetch courses', function() {
            spyOn(courseService, 'getLibraryCourses');
            component = $componentController('myLibrary',
                {$scope: scope},
                {}
            );

            component.courseFetchServiceCall(2, 4);

            expect(courseService.getLibraryCourses).toHaveBeenCalledWith(2, 4);
        });
    });
});
