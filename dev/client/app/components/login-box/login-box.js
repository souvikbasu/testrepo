(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:loginBox
     * @restrict E
     *
     * @description Login Panel for CLS
     *
     * @example <login-box></login-box>
     */
    angular.module('cls').controller('LoginBoxCtrl',
            ['$state', '$window', '$rootScope', 'appConfig', 'loginService', LoginBoxCtrl]).component('loginBox', {
        bindings: {},
        controller: 'LoginBoxCtrl',
        templateUrl: 'app/components/login-box/login-box.tmpl.html'
    });

    function LoginBoxCtrl($state, $window, $rootScope, appConfig, loginService) {
        var vm = this;
        vm.showErrorLogin = true;
        vm.showForgotPassword = false;
        vm.userImage = appConfig.deploy.cdnPathPrefix + 'static/images/login-user.png';
        vm.inputText = '';
        vm.forgotOptions = 'forgot_password';

        vm.loginToCLS = function() {
            vm.showErrorLogin = true;
            if (!vm.username) {
                vm.showErrorLogin = false;
                vm.errorText = 'LOGIN_EMPTY';
            } else if (!vm.userpassword) {
                vm.showErrorLogin = false;
                vm.errorText = 'PASS_EMPTY';
            }

            if (vm.showErrorLogin) {
                loginService.loginToCLS(vm.username, vm.userpassword).then(function(data) {
                    vm.errorText = '';
                    if (data === 'successStudent') {
                        loginService.privateSearchTypeAhead()
                            .then(function(response) {
                            $rootScope.privateSearchTypeAheadResponse = response;
                        });
                        $state.go('user.dashboard');
                    } else if (data === 'successAdmin') {
                        $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.adminUrl;
                    } else if (data === 'CATCmaTermsofUse') {
                        $state.go('termOfUse');
                    } else if (data === 'changePassword') {
                        $state.go('changePassword');
                    } else if (data !== '' || data !== null) {
                        var errorText = data.split('|');
                        if (errorText[1] !== '' || errorText[1] !== null) {
                            vm.errorText = errorText[1];
                            vm.showErrorLogin = false;
                        }
                    }
                    if (vm.showErrorLogin === true) {
                        $rootScope.searchText = '';
                    }
                });
            }
        };

        vm.isPopupVisible = false;

        vm.toggleSelect = function toggleSelect(popupVisible) {
            vm.isPopupVisible = popupVisible;
        };

        vm.toggleLoginPanel = function toggleLoginPanel() {
            vm.showForgotPassword = !vm.showForgotPassword;
            vm.showError = true;
            vm.showErrorLogin = true;
            vm.errorText1 = '';
            vm.errorText = '';
        };

        vm.actionForgot = function() {
            vm.showError = true;
            if (!vm.inputText) {
                vm.showError = false;
                vm.errorText1 = 'EMPTY_STRING';
            }

            if (vm.showError) {
                if (vm.forgotOptions === 'forgot_password') {
                    loginService.forgotPassword(vm.inputText, '', 1).then(function(data) {
                        vm.errorText1 = '';
                        if (data !== '' || data !== null) {
                            var errorText = data.split('|');
                            if (errorText[0] === 'success') {
                                vm.successMsg = errorText[1];
                            } else {
                                vm.errorText1 = data;
                                vm.showError = false;
                            }
                        }
                    });
                } else if (vm.forgotOptions = 'forgot_login') {
                    loginService.forgotPassword('', vm.inputText, 2).then(function(data) {
                        vm.errorText1 = '';
                        if (data !== '' || data !== null) {
                            var errorText = data.split('|');
                            if (errorText[0] === 'success') {
                                vm.successMsg = errorText[1];
                            } else {
                                vm.errorText1 = data;
                                vm.showError = false;
                            }
                        }
                    });
                }
            }
        };
    }
})();
