fdescribe('Component: login-box', function() {
    var component, scope, $componentController, loginService, $q, deferred, $state, appConfig, $window;

    beforeEach(module('cls'));

    beforeEach(inject(function($rootScope, _$componentController_, _$q_, _loginService_, _$state_, _appConfig_,
            _$window_) {
        scope = $rootScope.$new();
        $componentController = _$componentController_;
        loginService = _loginService_;
        $q = _$q_;
        deferred = _$q_.defer();
        $state = _$state_;
        appConfig = _appConfig_;
        $window = _$window_;
    }));

    it('should not allow to login if username is empty', function() {
        component = $componentController('loginBox', null, {});
        component.username = '';
        component.loginToCLS();

        expect(component.errorText).toEqual('LOGIN_EMPTY');
    });

    it('should not allow to login if password is empty', function() {
        component = $componentController('loginBox', null, {});
        component.userpassword = '';
        component.loginToCLS();

        expect(component.errorText).toEqual('PASS_EMPTY');
    });

    it('should call login service if username and password have valid data', function() {
        spyOn(loginService, 'loginToCLS').and.returnValue(deferred.promise);

        component = $componentController('loginBox', {
            $scope: scope
        }, {});
        component.username = 'test';
        component.userpassword = 'pass';
        component.loginToCLS();
        scope.$apply();

        expect(loginService.loginToCLS).toHaveBeenCalledWith(component.username, component.userpassword);
    });

    it('should not allow to login if username and password are incorrect', function() {
        spyOn(loginService, 'loginToCLS').and.returnValue(deferred.promise);

        component = $componentController('loginBox', {
            $scope: scope
        }, {});
        component.username = 'test';
        component.userpassword = 'pass';
        deferred.resolve('error|Bad Login/Password.');
        component.loginToCLS();
        scope.$apply();

        expect(component.errorText).toEqual('Bad Login/Password.');
    });

    it('should allow to login and redirect to Admin UI if username and password are correct', function() {
        spyOn(loginService, 'loginToCLS').and.returnValue(deferred.promise);

        component = $componentController('loginBox', {
            $scope: scope
        }, {});
        component.username = 'test';
        component.userpassword = 'pass';
        appConfig.clsUrls = [{}];

        component.loginToCLS();
        deferred.resolve('successAdmin');
        scope.$apply();

        expect(component.errorText).toEqual('');
    });

    it('should allow to login and redirect to TermsOfUse Page if the User is new', function() {
        spyOn(loginService, 'loginToCLS').and.returnValue(deferred.promise);

        component = $componentController('loginBox', {
            $scope: scope
        }, {});
        component.username = 'test';
        component.userpassword = 'pass';
        appConfig.clsUrls = [{}];

        component.loginToCLS();
        deferred.resolve('CATCmaTermsofUse');
        scope.$apply();

        expect(component.errorText).toEqual('');
    });

    it('should allow to login and redirect to ChangePassword Page if the User is new and accepted terms of use',
            function() {
                spyOn(loginService, 'loginToCLS').and.returnValue(deferred.promise);

                component = $componentController('loginBox', {
                    $scope: scope
                }, {});
                component.username = 'test';
                component.userpassword = 'pass';
                appConfig.clsUrls = [{}];

                component.loginToCLS();
                deferred.resolve('changePassword');
                scope.$apply();

                expect(component.errorText).toEqual('');
            });

    it('should close the dropdown if it is open', function() {
        spyOn(loginService, 'loginToCLS').and.returnValue(deferred.promise);

        component = $componentController('loginBox', null, {});
        component.isPopupVisible = true;
        component.toggleSelect(false);

        expect(component.isPopupVisible).toBe(false);
    });
});
