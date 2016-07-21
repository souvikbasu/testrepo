(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:hideOnScroll
     * @element div
     * @restrict A
     *
     * @description
     * Hide the control on scroll
     *
     * @example
     <div hide-on-scroll></div>
     */
    angular
        .module('cls')
        .directive('hideOnScroll', ['$window', hideOnScroll]);

    function hideOnScroll($window) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element) {
                angular.element($window).bind('scroll', function() {
                    if (this.pageYOffset > 50) {
                        element.addClass('ng-hide');
                    } else {
                        element.removeClass('ng-hide');
                    }
                });
            }
        };
    }
})();

