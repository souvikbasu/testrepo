(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:TermsOfUseCtrl
     * @description Controller for TermsOdUse Page. Makes all service calls to
     *              accept & reject terms of use.
     */
    angular.module('cls').controller('TermsOfUseCtrl',
            ['$scope', '$state', '$window', 'loginService', 'cleanUpService', TermsOfUseCtrl]);

    function TermsOfUseCtrl($scope, $state, $window, loginService, cleanUpService) {
        $scope.actionAccept = function() {
            loginService.acceptTermsOfUse(true).then(function(result) {
                if (result === 'changePassword') {
                    $state.go('changePassword');
                } else if (result === 'successAdmin') {
                    $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.adminUrl;
                } else if (result === 'successStudent') {
                    $state.go('user.dashboard');
                } else if (result === 'successTeacher') {
                    $window.location.href = appConfig.deploy.envPathPrefix + appConfig.clsUrls.teacherUrl;
                }
            });
        };

        $scope.actionReject = function() {
            loginService.acceptTermsOfUse(false).then(function(result) {
                if (result === 'logout') {
                    cleanUpService.cleanUp();
                    $state.go('home');
                }
            });
        };
    }
})();
