fdescribe('Component: my-favorites', function() {
    var component, $rootScope, $componentController, scope, $stateParams, appSettingsService, courseService,
        $q, deferred, deferredFav, $state, httpBackend;

    beforeEach(module('cls'));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _$stateParams_, _$q_, _appSettingsService_,
            _courseService_, _$state_, $httpBackend, $injector) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $componentController = _$componentController_;
        $stateParams = _$stateParams_;
        $q = _$q_;
        deferred = _$q_.defer();
        deferredFav = _$q_.defer();
        $state = _$state_;
        appSettingsService = _appSettingsService_;
        courseService = _courseService_;
        httpBackend = $injector.get('$httpBackend');
    }));


    describe('summary attribute', function() {
        it('should return value of summary', function() {
            component = $componentController('myFavorites',
                    null,
                    {summary: '1'}
            );
            expect(component.isSummary()).toBeTruthy();

            component = $componentController('myFavorites',
                    null,
                    {summary: '0'}
            );
            expect(component.isSummary()).toBeFalsy();
        });
    });

    describe('title, description, rows attribute', function() {
        it('should set title, description, rows attribute', function() {
            component = $componentController('myFavorites',
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

            component = $componentController('myFavorites',
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
            httpBackend.expect('POST', 'http://localhost:8080/services/access').respond(200, {
                status: 'success'
            });
            $stateParams.title = null;
            $stateParams.desc = 'New Description';
            $stateParams.rows = 5;
            spyOn(appSettingsService, 'getZoneSettings').and.returnValue(deferred.promise);

            component = $componentController('myFavorites',
                {$scope: scope},
                {
                    title: null,
                    desc: 'Old Description',
                    rows: 2
                }
            );

            httpBackend.when('POST').respond(deferred);
            deferred.resolve({
                layPref: [
                    {
                        id: 4,
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

        it('should replace title, description, rows values from appSettings only if id=4', function() {
            $stateParams.title = null;
            $stateParams.desc = 'New Description';
            $stateParams.rows = 5;
            spyOn(appSettingsService, 'getZoneSettings').and.returnValue(deferred.promise);

            component = $componentController('myFavorites',
                {$scope: scope},
                {
                    title: null,
                    desc: 'Old Description',
                    rows: 2
                }
            );

            httpBackend.when('POST').respond(deferred);
            deferred.resolve({
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

    describe('fetch fav courses', function() {
        beforeEach(inject(
                function(_$state_) {
                    $state = _$state_;
                }));

        it('should call getTopFavoriteCourses with no of favorite courses to fetch', function() {
            spyOn(courseService, 'getTopFavoriteCourses').and.returnValue(deferredFav.promise);
            component = $componentController('myFavorites',
                    {$scope: scope},{}
                );
            expect(courseService.getTopFavoriteCourses).toHaveBeenCalledWith(-1);
        });

        it('should redirect to user.favorites state on click of See All', function() {
            spyOn($state, 'go').and.returnValue(deferred.promise);

            component = $componentController('myFavorites',
                null,
                {
                    title: 'Title',
                    desc: 'Desc'
                }
            );

            component.seeAll();

            expect($state.go).toHaveBeenCalledWith('user.favorites', {title: 'Title', desc: 'Desc'});
        });

        it('should set course list on receive of broadcast message courseListUpdated', function() {
            component = $componentController('myFavorites',
                {$scope: scope},
                {}
            );

            component.latestCourses = [{}];
            $rootScope.$broadcast('courseListUpdated', component.latestCourses);
        });
    });

    describe('favorite courses sorting', function() {
        it('should have a method to sort favorite courses', function() {
            component = $componentController('myFavorites',
                null,
                {}
            );
            component.latestCourseRows  = [{}];
            component.latestCourses = [{}];
            component.sortOrderChange('cT');
        });
    });

    describe('remove from favorites', function() {
        it('should have a method to unmark favorite courses', function() {
            component = $componentController('myFavorites',
                null,
                {}
            );
            component.latestCourses = [{}];
            $rootScope.$broadcast('updateLibrary');
            $rootScope.$broadcast('updateFavorites');
            component.removeFavorites(1276, false);
        });
    });

    describe('fetch more favorite courses on scroll down', function() {
        it('should have a method to get more favorite courses on scroll down', function() {
            component = $componentController('myFavorites',
                null,
                {}
            );
            component.latestCourses = [{}];
            component.getMoreCourses();
        });
    });
});
