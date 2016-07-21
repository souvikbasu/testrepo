(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:onEnterDown
     * @restrict A
     * @description detects the enter key press event on element
     * @param {ng Expression} searchFn function to be called on detecting the event
     *
     * @example <input type="search" search-fn="$ctrl.search()" on-enter-down >
     */
    angular.module('cls').directive('onEnterDown', [onEnterDown]);

    function onEnterDown() {
        return {
            restrict: 'A',
            scope: {
                searchFn: '&'
            },
            link: function(scope, element) {
                element.bind('keydown', function(event) {
                    // event for enter key down
                    if (event.which === 13) {
                        scope.searchFn();
                    }
                });
            }
        };
    }
})();
