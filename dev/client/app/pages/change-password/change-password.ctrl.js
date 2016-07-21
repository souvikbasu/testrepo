(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:ChangePasswordCtrl
     * @description Controller for change password page. Makes all service calls to
     *              change the password of the user
     */
    angular.module('cls').controller('ChangePasswordCtrl',
            ['$scope', '$window', '$state', 'loginService', 'cleanUpService', ChangePasswordCtrl]);

    function ChangePasswordCtrl($scope, $window, $state, loginService, cleanUpService) {
        $scope.errorText = '';
        $scope.flag = true;
        $scope.oldPassword = '';
        $scope.newPassword = '';
        $scope.confirmPassword = '';

        $scope.changePassword = function() {
            $scope.flag = true;
            if ($scope.oldPassword === '' || $scope.oldPassword === null ||
                    $scope.newPassword === '' || $scope.newPassword === null ||
                        $scope.confirmPassword === '' || $scope.confirmPassword === null) {
                $scope.flag = false;
                $scope.errorText = 'PASS_EMPTY1';
            }

            if ($scope.flag) {
                loginService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmPassword).then(
                        function(result) {
                            if (result === 'successAdmin') {
                                $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.adminUrl;
                            } else if (result === 'successStudent') {
                                $state.go('user.dashboard');
                            } else if (result === 'successTeacher') {
                                $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.teacherUrl;
                            } else if (result !== '' || result !== null) {
                                var errorText = result.split('|');
                                if (errorText[0] === 'error' && (errorText[1] !== '' || errorText[1] !== null)) {
                                    $scope.errorText = errorText[1];
                                    $scope.flag = false;
                                }
                            }
                        });
            }
        };

        $scope.cancel = function() {
            loginService.cancelChangePassword().then(function(result) {
                if (result === 'logout') {
                    cleanUpService.cleanUp();
                    $state.go('home');
                }
            });
        };
    }
})();
