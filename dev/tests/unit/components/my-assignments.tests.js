describe('Component: my-assignments', function() {
    var component, $componentController, scope, $stateParams, $q, deferredZoneSettings, deferredAssignments;

    beforeEach(module('cls'));


    beforeEach(function() {
        module(function($provide) {
            $provide.factory('appSettingsService', function() {
                return {
                    getZoneSettings: jasmine.createSpy('getZoneSettings').and.returnValue(deferredZoneSettings.promise)
                };
            });

            $provide.factory('programService', function() {
                return {
                    getLatestMyAssignments: jasmine.createSpy('getLatestMyAssignments')
                        .and.returnValue(deferredAssignments.promise)
                };
            });
        });
    });


    beforeEach(inject(function($rootScope, _$componentController_, _$stateParams_, _$q_) {
        scope = $rootScope.$new();
        $componentController = _$componentController_;
        $stateParams = _$stateParams_;
        $q = _$q_;
        deferredZoneSettings = _$q_.defer();
        deferredAssignments = _$q_.defer();
    }));


    it('should return value of summary', function() {
        component = $componentController('myAssignments',
            null,
            {summary: '1'}
        );
        expect(component.isSummary()).toBeTruthy();

        component = $componentController('myAssignments',
            null,
            {summary: '0'}
        );
        expect(component.isSummary()).toBeFalsy();
    });


    it('should set title, description, rows attribute', function() {
        component = $componentController('myAssignments',
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

        component = $componentController('myAssignments',
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


    it('should replace title, description, rows values from appSettings', function() {
        $stateParams.title = 'New Title';
        $stateParams.desc = 'New Description';
        $stateParams.rows = 5;

        component = $componentController('myAssignments',
            {$scope: scope},
            {
                title: 'Old Title',
                desc: 'Old Description',
                rows: 2
            }
        );

        deferredZoneSettings.resolve({
            layPref: [
                {
                    id: 1,
                    zn: 'Title from app settings service',
                    desc: 'Description from app settings service',
                    nRow: 10
                }
            ]
        });

        deferredAssignments.resolve({
            assignArr: [],
            tCnt: 0
        });
        scope.$apply();

        expect(component.title).toBe('Title from app settings service');
        expect(component.desc).toBe('Description from app settings service');
        expect(component.rows).toBe(10);
    });


    it('should replace title, description, rows values from appSettings only if id=1', function() {
        component = $componentController('myAssignments',
            {$scope: scope},
            {
                title: 'Old Title',
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

        deferredAssignments.resolve({
            assignArr: [],
            tCnt: 0
        });
        scope.$apply();

        expect(component.title).toBe('Old Title');
        expect(component.desc).toBe('Old Description');
        expect(component.rows).toBe(2);
    });
});
