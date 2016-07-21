(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.cleanUpService
     * @description
     * Service to clean all application settings, global variables, rootScope
     *
     */
    angular
        .module('cls')
        .factory('cleanUpService', ['$window', '$rootScope',
                                    cleanUpService]);

    function cleanUpService($window, $rootScope) {
        return {
            cleanUp: cleanUp
        };


        // Private member definitions
        // ===================================================================================


        /**
         * @ngdoc method
         * @name cleanUpScope
         * @methodOf cls.cleanUpService
         * @description
         * Cleans rootScope variable, sessionStorage and cookies
         *
         * @return {boolean} After clean up it will return true
         */
        function cleanUp() {
            // $cookies.remove('jstree_open', {path: '/', expires: '0'});
            // $cookies.remove('jstree_close', {path: '/', expires: '0'});
            // $cookies.remove('jstree_load', {path: '/', expires: '0'});
            // $cookies.remove('jstree_select', {path: '/', expires: '0'});
            $window.sessionStorage.clear();
            $rootScope = $rootScope.$new(true);
            return true;
        }
    }
})();
