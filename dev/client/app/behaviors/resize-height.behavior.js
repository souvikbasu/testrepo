(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:resizeHeight
     * @element div
     * @restrict A
     *
     * @description
     * Resizes element's height as per available viewport height
     *
     * @example
         <div style="width:200px;background-color:red;" resize-height></div>
     */
    angular
        .module('cls')
        .directive('resizeHeight', ['$window', resizeHeight]);

    function resizeHeight($window) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element) {
                var style = element.attr('style') || '';
                style += 'height: ' + ($window.innerHeight - 50) + 'px;';
                element.attr('style', style);
            }
        };
    }
})();

