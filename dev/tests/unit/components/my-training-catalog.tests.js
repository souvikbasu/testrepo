describe('Component: my-training-catalog', function() {
    var component, $componentController, $stateParams, $q, $httpBackend,
        $rootScope, appSettingsService, deferredZoneSettings, scope, $state;

    beforeEach(module('cls'));

    beforeEach(inject(function(_$componentController_, _$stateParams_, _$q_,
                            _$httpBackend_, _$rootScope_, _appSettingsService_,
                               _$state_) {
        $componentController = _$componentController_;
        $stateParams = _$stateParams_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        appSettingsService = _appSettingsService_;
        deferredZoneSettings = _$q_.defer();
        $state = _$state_;
    }));

    it('should create component', function() {
        component = $componentController('myTrainingCatalog',
            null,
            {}
        );
    });

    it('should check if card to be shown in summary view of dashboard or not',
        function() {
        component = $componentController('myTrainingCatalog',
            null,
            {summary: '1'}
        );

        expect(component.isSummary()).toBe(true);
    });

    it('should set title, desc and rows on basis of stateParams values',
       function() {
        $stateParams.title = 'I am dummy title for testing.';
        $stateParams.desc = 'I am dummy description for testing.';
        $stateParams.rows = 2;

        component = $componentController('myTrainingCatalog',
            null,
            {}
        );

        expect(component.title).toBe('I am dummy title for testing.');
        expect(component.desc).toBe('I am dummy description for testing.');
        expect(component.rows).toBe(2);
    });

    it('should fetch zone settings', function() {
        spyOn(appSettingsService, 'getZoneSettings').and.returnValue(deferredZoneSettings.promise);

        component = $componentController('myTrainingCatalog',
            {$scope: scope},
            {
                title: null,
                desc: 'Old Description',
                rows: 3
            }
        );

        $httpBackend.when('POST').respond(deferredZoneSettings);
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

        expect(component.title).toBe('Title from app settings service');
        expect(component.desc).toBe('Description from app settings service');
        expect(component.rows).toBe(10);
    });

    it('should disable all other cards expansion when clicked on any card details button',
      function() {
        component = $componentController('myTrainingCatalog',
            null,
            {}
        );
        var event,
            parent = 'catalogs';

        $rootScope.$broadcast('resetDetailsIndex', event, parent);
    });

    it('should redirect to user.training-catalogs state on click of See All', function() {
        spyOn($state, 'go').and.returnValue(deferredZoneSettings.promise);

        component = $componentController('myTrainingCatalog',
            null,
            {
                title: 'Title',
                desc: 'Desc'
            }
        );

        component.seeAll();

        expect($state.go).toHaveBeenCalledWith('user.training-catalogs', {title: 'Title', desc: 'Desc'});
    });
});
