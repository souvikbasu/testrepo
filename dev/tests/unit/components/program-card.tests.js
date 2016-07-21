describe('Component: program-card', function() {
    var component, $state, $componentController, $rootScope, $timeout,
        $q, programService, scope, appConfig, deferredAssignmentsLevel2,
        deferredCatalogLevel2;

    beforeEach(module('cls'));


    beforeEach(inject(function(_$componentController_, _$rootScope_,
                                _$timeout_, _$q_, _programService_, _appConfig_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $componentController = _$componentController_;
        $timeout = _$timeout_;
        $q = _$q_;
        deferredAssignmentsLevel2 = _$q_.defer();
        deferredCatalogLevel2 = _$q_.defer();
        programService = _programService_;
        appConfig = _appConfig_;
    }));


    it('should assign the name bindings to title', function() {
        component = $componentController('programCard',
            null,
            {title: 'ABC'}
        );
        expect(component.title).toBe('ABC');
    });


    it('should calculate percentageComplete', function() {
        component = $componentController('programCard',
            null,
            {total: 300, completed: 150}
        );
        $timeout.flush();
        expect(component.percentageComplete).toBe(50);
    });


    it('should not calculate percentageComplete if completed value is not specified', function() {
        component = $componentController('programCard',
            null,
            {total: 300}
        );
        $timeout.flush();
        expect(component.percentageComplete).toBe(0);
    });

    describe('Details of course', function() {
        it('should close expand of card if it is already expanded', function() {
            component = $componentController('programCard',
                null,
                {}
            );
            component.details = true;
            component.enableDetails();

            expect(component.details).toBe(false);
        });

        it('should set height of card by 260px if expansion closed', function() {
            component = $componentController('programCard',
                null,
                {}
            );
            component.details = true;
            component.enableDetails();

            expect(component.summaryHeight).toBe('260px');
        });

        it('should fetch data to show in assignment card expansion', function() {
            spyOn(programService, 'getAssignmentsDetails')
                .and.returnValue(deferredAssignmentsLevel2.promise);
            component = $componentController('programCard',
                null,
                {parent: 'assignments', id: 45724}
            );

            component.details = false;
            component.enableDetails();

            expect(programService.getAssignmentsDetails).toHaveBeenCalledWith(component.id);
        });

        it('should fetch data to show in catalog card expansion', function() {
            spyOn(programService, 'getTrainingCatalogCourseDetails')
                .and.returnValue(deferredCatalogLevel2.promise);
            component = $componentController('programCard',
                null,
                {parent: 'catalogs', id: 45724}
            );

            component.details = false;
            component.enableDetails();

            expect(programService.getTrainingCatalogCourseDetails).toHaveBeenCalledWith(component.id);
        });

        it('should set data in catalog card after fetching', function() {
            spyOn(programService, 'getTrainingCatalogCourseDetails')
                .and.returnValue(deferredCatalogLevel2.promise);
            component = $componentController('programCard',
                {$scope: scope},
                {parent: 'catalogs'}
            );

            component.details = false;
            component.enableDetails();

            deferredCatalogLevel2.resolve('a');
            scope.$apply();

            expect(component.trainingCatalogDetails).toBe('a');
        });

        it('should set data in catalog card after fetching', function() {
            spyOn(programService, 'getAssignmentsDetails')
                .and.returnValue(deferredAssignmentsLevel2.promise);
            component = $componentController('programCard',
                {$scope: scope},
                {parent: 'assignments'}
            );

            component.details = false;
            component.enableDetails();

            deferredAssignmentsLevel2.resolve([{}, {}]);
            scope.$apply();

            expect(component.trainingCatalogDetails).toEqual([{}, {}]);
            expect(component.programCardDetailsHeight).toEqual({height: '220px'});
            expect(component.summaryHeight).toEqual('480px');
        });
    });

    describe('Enroll for course', function() {
        it('should close expansion of card to has be enrolled', function() {
            component = $componentController('programCard',
                null,
                {}
            );

            component.details = true;
            component.enroll();

            expect(component.details).toBe(false);
            expect(component.summaryHeight).toBe('260px');
        });

        it('should flip card after enroll', function() {
            component = $componentController('programCard',
                null,
                {}
            );

            component.enroll();

            expect(component.flipFront).toEqual({transform: 'rotateY(180deg)'});
            expect(component.flipBack).toEqual({transform: 'rotateY(0deg)'});
        });
    });

    describe('Confirm on enroll of moderated course', function() {
        it('should flip card after confirmation', function() {
            component = $componentController('programCard',
                null,
                {}
            );

            component.confirmModerateEnroll();

            expect(component.flipFront).toEqual({transform: 'rotateY(0deg)'});
            expect(component.flipBack).toEqual({transform: 'rotateY(-180deg)'});
        });

        it('should should set status to 2', function() {
            component = $componentController('programCard',
                null,
                {}
            );

            component.confirmModerateEnroll();

            expect(component.status).toBe(2);
        });
    });

    describe('Cancel enroll', function() {
        it('should flip card back to its original position', function() {
            component = $componentController('programCard',
                null,
                {}
            );

            component.cancelEnroll();

            expect(component.flipFront).toEqual({transform: 'rotateY(0deg)'});
            expect(component.flipBack).toEqual({transform: 'rotateY(-180deg)'});
        });
    });

    it('should reset expanded card on receive of broadcast message disableDetails', function() {
        component = $componentController('programCard',
            {$scope: scope},
            {}
        );

        $rootScope.$broadcast('disableDetails');

        expect(component.details).toEqual(false);
        expect(component.summaryHeight).toEqual('260px');
        expect(component.programCardDetailsHeight).toEqual({height: '0px'});
    });

    describe('Set parameter object and redirect to course details page', function() {
        beforeEach(inject(
            function(_$state_) {
                $state = _$state_;
            }));

        it('should set language preoperty if not already available', function() {
            spyOn($state, 'go');
            component = $componentController('programCard',
                null,
                {}
            );

            var lesson = {lan: ''};
            appConfig.userHomePage.userProfileLanguage = 'en';
            component.courseDetails(lesson);

            expect(lesson.lan).toEqual('en');
        });

        it('should redirect to course meta data page on click of course', function() {
            spyOn($state, 'go');
            component = $componentController('programCard',
                null,
                {}
            );

            var lesson = {lan: 'en'};
            component.courseDetails(lesson);

            expect($state.go).toHaveBeenCalled();
        });
    });
});
