(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.appSettingsService
     * @description
     * Service to return all app settings
     *
     */
    angular
        .module('cls')
        .factory('appSettingsService', ['$q', 'smartHttp', 'appConfig', appSettingsService]);

    function appSettingsService($q, smartHttp, appConfig) {
        return {
            getZoneSettings: getZoneSettings
        };


        // Private member definitions
        // ===================================================================================


        /**
         * @ngdoc method
         * @name getZoneSettings
         * @methodOf cls.appSettingsService
         * @description
         * Get all user home page zones settings
         *
         * @return {Promise} On success the promise will be resolved with Zone settings
         */
        function getZoneSettings() {
            return smartHttp
                .post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.zones)
                .then(function(settings) {
                    return settings;
                });
        }
    }
})();
