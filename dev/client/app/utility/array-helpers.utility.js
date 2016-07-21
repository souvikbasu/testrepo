(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.arrayHelpers
     * @description
     * List of handy methods for array manipulation
     *
     */
    angular
        .module('cls')
        .factory('arrayHelpers', mappers);

    function mappers() {
        return {
            addUniqueElements: addUniqueElements,
            remove: remove,
            anyMatch: anyMatch,
            sort: sort,
            containsIn: containsIn,
            sortByNumProperty: sortByNumProperty
        };


        // Private member definitions
        // ===================================================================================

        /**
         * @ngdoc method
         * @name addUniqueElements
         * @methodOf cls.arrayHelpers
         * @description
         * Adds unique elements from source array to destination array
         *
         * @param {Array} destination Array where element will be added
         * @param {Array} source Each element from this array is matched with destination array and unique elements
         * @param {string} fieldName Name of the field to match
         * are added to destination
         */
        function addUniqueElements(destination, source, fieldName) {
            for (var i = 0, s; s = source[i]; i++) {
                var found = false;
                for (var j = 0, d; d = destination[j]; j++) {
                    if (s[fieldName] === d[fieldName]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    destination.push(s);
                }
            }
        }


        /**
         * @ngdoc method
         * @name remove
         * @methodOf cls.arrayHelpers
         * @description
         * Remove object from array
         *
         * @param {Array} destination Array where element will be removed
         * @param {Object} item element to be removed
         */
        function remove(destination, item, field) {
            for (var i = 0, existing; existing = destination[i]; i++) {
                if (item[field] === existing[field]) {
                    destination.splice(i, 1);
                    return;
                }
            }
        }


        /**
         * @ngdoc method
         * @name anyMatch
         * @methodOf cls.arrayHelpers
         * @description
         * Returns true if any element from arrayB matches in elements from arrayA
         *
         * @param {Array} arrayA Array where element will be searched
         * @param {Array} arrayB Each element from this array is searched in arrayA
         * @param {string} fieldName Name of the field to match with
         * are added to destination
         * @return {Boolean} True if object is found in array
         */
        function anyMatch(arrayA, arrayB, fieldName) {
            if (!arrayA.length) {
                return true;
            }

            for (var i = 0, a; a = arrayA[i]; i++) {
                if (a[fieldName] == null) {  // true if field does not exists in arrayA
                    return true;
                }

                for (var j = 0, b; b = arrayB[j]; j++) {
                    if (a[fieldName] === b[fieldName]) {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * @ngdoc method
         * @name sort
         * @methodOf cls.arrayHelpers
         * @description
         * Sort an array
         *
         * @param {Array} arr Array to sort
         * @param {string} fieldName field to sort
         */
        function sort(arr, fieldName) {
            arr.sort(function(a, b) {
                var fieldA = a[fieldName].toLowerCase(),
                    fieldB = b[fieldName].toLowerCase();
                if (fieldA < fieldB) {
                    return -1;
                }
                if (fieldA > fieldB) {
                    return 1;
                }
                return 0;
            });
        }

        /**
         * @ngdoc method
         * @name containsIn
         * @methodOf cls.arrayHelpers
         * @description
         * check whether element contains in given HTMLCollection
         *
         * @param {Array} objArray Array to find in
         * @param {object} elem element to find
         * @return {Boolean} True if object is found in objArray
         */
        function containsIn(objArray, elem) {
            // objArray is not an Array but HTMLCollection
            for (var i = 0; i < objArray.length; i++) {
                var p = objArray[i];
                if (elem === p) {
                    return true;
                }
            }
            return false;
        }

        /**
         * @ngdoc method
         * @name sortByNumProperty
         * @methodOf cls.arrayHelpers
         * @description
         * Sort an array by parameter
         *
         * @param {string} fieldName field to sort
         */
        function sortByNumProperty(fieldName) {
            return function(x, y) {
                return ((x[fieldName] === y[fieldName]) ? 0
                        : ((x[fieldName] > y[fieldName]) ? 1 : -1));
            };
        }
    }
})();
