describe('Component: cls-header', function() {
    var component, $componentController, $q, $state, $rootScope,
        appSettingsService, deferredZoneSettings, appConfig, scope;

    beforeEach(module('cls'));


    beforeEach(inject(function(_$componentController_, _$q_, _$state_,
                               _$rootScope_, _appSettingsService_, _appConfig_) {
        $componentController = _$componentController_;
        $q = _$q_;
        $state = _$state_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        appSettingsService = _appSettingsService_;
        appConfig = _appConfig_;
        deferredZoneSettings = _$q_.defer();
    }));

    // TODO: Test case for this feature is still Pending
    it('should select zone as dashboard when state is user.dashboard', function() {
        component = $componentController('clsHeader',
            null,
            {}
        );
    });

    it('should set user details after login', function() {
        spyOn(appSettingsService, 'getZoneSettings').and.returnValue(deferredZoneSettings.promise);

        component = $componentController('clsHeader',
            {$scope: scope},
            {}
        );

        deferredZoneSettings.resolve({
            uId: 123,
            uRoleId: 123,
            fNm: 'Kamal',
            lNm: 'Kokne',
            roles: [{}, {}],
            uiLang: 'en',
            layPref: [{}, {}]
        });
        scope.$apply();

        expect(component.userAuthenticate).toBe(true);
        expect(component.user.firstName).toBe('Kamal');
        expect(component.user.lastName).toBe('Kokne');
        expect(component.roles.length).toBe(2);
        expect(appConfig.userHomePage.userProfileLanguage).toBe('en');
    });
});
