(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:clsHeader
     * @restrict E
     *
     * @description Header component to show in all pages
     *
     * @example <cls-header></cls-header>
     */
    angular.module('cls').controller(
            'ClsHeaderCtrl',
            ['$rootScope', '$scope', '$state', '$window', 'appConfig', 'loginService', 'appSettingsService',
                    'cleanUpService', ClsHeaderCtrl]).component('clsHeader', {
        bindings: {},
        controller: 'ClsHeaderCtrl',
        templateUrl: 'app/components/cls-header/cls-header.tmpl.html'
    });

    function ClsHeaderCtrl($rootScope, $scope, $state, $window, appConfig, loginService, appSettingsService,
            cleanUpService) {
        var vm = this, actionSwitchRole = true;
        // Have to use $scope instead of vm as children are using zones.
        $scope.zones = [];
        vm.user = {};
        vm.roles = [];
        vm.userImage = appConfig.deploy.cdnPathPrefix + 'static/images/user.png';
        vm.showUserRoles = false;
        vm.isUserAuthenticated = false;

        if ($state.$current.name === 'user.dashboard') {
            vm.selectedZone = 'dashboard';
        } else if ($rootScope.enablePreviousState) {
            vm.selectedZone = $rootScope.enablePreviousState.split('.')[1];
        }

        appSettingsService.getZoneSettings().then(function(settings) {
            if (settings === null ||
                settings === undefined ||
                !settings ||
                settings === '') {
                vm.isUserAuthenticated = false;
            } else {
                vm.isUserAuthenticated = true;
                vm.userAuthenticate = settings.uRoleId != null;
                vm.currentRoleId = settings.uRoleId;
                vm.user.firstName = settings.fNm;
                vm.user.lastName = settings.lNm;
                vm.roles = settings.roles;
                // Setting Profile Language in global variable
                appConfig.userHomePage.userProfileLanguage = settings.uiLang;
                settings.layPref.forEach(function(layout) {
                    if (layout.vis) {
                        $scope.zones.push({
                            name: vm.getZoneNameFromId(layout.id),
                            title: layout.zn,
                            desc: layout.desc,
                            order: layout.ordr,
                            rows: layout.nRow
                        });
                    }
                });
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name.match(/^(user.assignments|user.library|user.favorites|user.training-catalogs)$/)) {
                vm.selectedZone = toState.name.split('.')[1];
            }
        });

        vm.zoneSelected = function(zone, closeDialog) {
            closeDialog = closeDialog || false;
            if (closeDialog) {
                vm.modalVisible = false;
            }

            if (zone === 'dashboard') {
                $state.go('user.dashboard');
                vm.selectedZone = 'dashboard';
            } else {
                $state.go('user.' + zone.name, {
                    title: zone.title,
                    desc: zone.desc,
                    rows: 0
                });
                vm.selectedZone = zone.name;
            }
        };

        vm.companionHome = function() {
            $state.go('home');
        };

        vm.getZoneNameFromId = function(id) {
            if (id === 1) {
                return 'assignments';
            } else if (id === 2) {
                return 'library';
            } else if (id === 3) {
                return 'training-catalogs';
            } else if (id === 4) {
                return 'favorites';
            } else if (id === 5) {
                return 'recent-courses';
            } else {
                return '';
            }
        };

        vm.modalVisible = false;
        vm.toggleModal = function() {
            vm.modalVisible = !vm.modalVisible;
        };

        vm.menuVisible = false;
        vm.toggleMenu = function() {
            vm.menuVisible = !vm.menuVisible;
        };

        vm.toggleMenuPanel = function(menuVisible) {
            vm.menuVisible = menuVisible;
        };

        vm.logout = function() {
            loginService.logout().then(function(data) {
                if (data === 'success') {
                    cleanUpService.cleanUp();
                    $window.location.href = appConfig.deploy.envPathPrefix +
                        appConfig.clsUrls.newuiLogin;
                }
            });
        };

        vm.isPopupVisible = false;

        vm.toggleSelect = function toggleSelect(isPopupVisible) {
            vm.isPopupVisible = isPopupVisible;
        };

        vm.toggleSelect1 = function() {
            vm.isPopupVisible = !vm.isPopupVisible;
        };

        vm.switchRole = function(roleId) {
            loginService.switchRole(roleId).then(function(data) {
                actionSwitchRole = false;
                if (data === 'HomeAdmin') {
                    $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.adminUrl;
                } else if (data === 'HomeTeacher') {
                    $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.teacherUrl;
                } else if (data === 'HomeStudent') {
                    $state.reload();
                }
            });
        };
        vm.mySettings = function() {
            $state.go('mySettings');
        };

        /*$window.onbeforeunload = function() {
            if (actionSwitchRole) {
                loginService.logout().then(function(data) {
                    if (data === 'success') {
                        cleanUpService.cleanUp();
                    }
                });
            }
        };*/
    }
})();
