(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.mappers
     * @description
     * List of handy methods to convert one data form to another
     *
     */
    angular
        .module('cls')
        .factory('mappers', mappers);

    function mappers() {
        return {
            getDateFromString: getDateFromString,
            getStringFromDate: getStringFromDate
        };


        // Private member definitions
        // ===================================================================================

        /**
         * @ngdoc method
         * @name getDateFromString
         * @methodOf cls.mappers
         * @description
         * Convert date from string to Date object
         *
         * @param {string} dateString Date in string format
         * @return {Date} UTC Date object
         */
        function getDateFromString(dateString) {
            var dateParts = dateString.split('/');
            return new Date(Date.UTC(dateParts[2], dateParts[0] - 1, dateParts[1]));
        }


        /**
         * @ngdoc method
         * @name getStringFromDate
         * @methodOf cls.mappers
         * @description
         * Convert date from Date object to string
         *
         * @param {Date} date UTC Date object
         * @return {string} Date in string format
         */
        function getStringFromDate(date) {
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }
    }
})();
