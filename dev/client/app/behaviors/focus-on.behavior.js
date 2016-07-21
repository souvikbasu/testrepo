(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:focusOn
     * @element input
     * @restrict A
     *
     * @description
     * Focuses on the input control based on the trigger configured
     *
     * @param {ng Expression} trigger Expression to trigger focus
     * method
     *
     * @example
     <input focus-on="focusCondition" />
     */
    angular
        .module('cls')
        .directive('focusOn', ['$timeout', focusOn]);

    function focusOn($timeout) {
        return {
            restrict: 'A',
            scope: {
                trigger: '=focusOn'
            },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    $timeout(function() {
                        if (value === true) {
                            element[0].focus();
                            element.addClass('focused');
                        } else {
                            element.removeClass('focused');
                        }
                    });
                });
            }
        };
    }
})();
