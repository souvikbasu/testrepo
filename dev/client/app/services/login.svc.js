(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.loginService
     * @description
     * Service to authenticate the user
     */
    angular.module('cls').factory('loginService', ['smartHttp', 'appConfig', loginService]);

    function loginService(smartHttp, appConfig) {
        return {
            loginToCLS: loginToCLS,
            logout: logout,
            switchRole: switchRole,
            acceptTermsOfUse: acceptTermsOfUse,
            changePassword: changePassword,
            cancelChangePassword: cancelChangePassword,
            getUserProfile: getUserProfile,
            forgotPassword: forgotPassword,
            privateSearchTypeAhead: privateSearchTypeAhead,
            saveUserSettings: saveUserSettings
        };

        /**
         * @ngdoc method
         * @name loginToCLS
         * @methodOf cls.loginService
         * @description
         * Authenticate the user
         * @param {string} username loginId of the user
         * @param {string} password password of the user
         * @return {string} string which specifies whether user is authenticated or not
         */
        function loginToCLS(username, password) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.login, {
                username: username,
                userpassword: password
            });
        }

        /**
         * @ngdoc method
         * @name logout
         * @methodOf cls.loginService
         * @description
         * logout the user from system
         */
        function logout() {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.logout, {});
        }

        /**
         * @ngdoc method
         * @name switchRole
         * @methodOf cls.loginService
         * @description
         * Change the role of the user
         * @param {int} userRoleId userRoleIf of the user
         * @return {string} string which decides where to redirect to which user role page
         */
        function switchRole(userRoleId) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.switchRole, {
                userRoleId: userRoleId
            });
        }

        /**
         * @ngdoc method
         * @name acceptTermsOfUse
         * @methodOf cls.loginService
         * @description
         * Accept terms of use
         */
        function acceptTermsOfUse(termsAccepted) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.termsOfUse, {
                tnc:termsAccepted
            });
        }

        /**
         * @ngdoc method
         * @name changePassword
         * @methodOf cls.loginService
         * @description
         * Changes the password of the user
         * @param {string} op old password of the user
         * @param {string} np new password of the user
         * @param {string} cp confirm password of the user
         */
        function changePassword(op,np,cp) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.changePass, {
                op: op,
                np: np,
                cp: cp
            });
        }

        /**
         * @ngdoc method
         * @name cancelChangePassword
         * @methodOf cls.loginService
         * @description
         * Cancels change the password page of the user and redirects to homepage
         */
        function cancelChangePassword() {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.cancelChangePass, {});
        }

        /**
         * @ngdoc method
         * @name getUserProfile
         * @methodOf cls.loginService
         * @description
         * Fetch user's details
         */
        function getUserProfile() {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.getUserProfile, {});
        }

        /**
         * @ngdoc method
         * @name changePassword
         * @methodOf cls.loginService
         * @description
         * Changes the password of the user
         * @param {string} loginId login of the user
         * @param {string} email email of the user
         * @param {string} mode mode = 1 = forgot password, mode = 2 = forgot login id
         */
        function forgotPassword(loginId,email,mode) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.forgotPass, {
                login: loginId,
                email: email,
                mode: mode
            });
        }

        /**
         * @ngdoc method
         * @name privateSearchTypeAhead
         * @methodOf cls.courseService
         * @description
         * Search meta information for all the courses of respective user
         *
         * @return {Promise} On success the promise will be resolved
         */
        function privateSearchTypeAhead() {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.privateSearchTypeAhead);
        }

        /**
         * @ngdoc method
         * @name saveUserSettings
         * @methodOf cls.loginService
         * @description
         * Save user's details
         */
        function saveUserSettings(selZones) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.saveUserSettings, {
                zones: selZones
            });
        }
    }
})();
