(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.appConfig
     * @description
     * Application wide configuration used in bootstrapping the app
     *
     */
    angular
        .module('cls')
        .constant('appConfig', appConfig)
        .constant('appConstants', appConstants);
})();
