(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:infiniteScroll
     * @element div
     * @restrict A
     *
     * @description
     * Infinitely scroll a page vertically. The callback is executed when the scroll bar reaches page end, to add more
     * items to the page
     *
     * @param {function} on-scroll-end Method to call when the scroll bar reaches page end
     * @param {boolean} infinite-scroll-skip Flag to decide when to skip call to on-scroll-end method
     * @param {int} infinite-scroll-offset Value of distance of scroll bar from page end in px to call on-scroll-end
     * method
     *
     * @example
     <div infinite-scroll on-scroll-end="$ctrl.getMoreCourses()" infinite-scroll-skip="$ctrl.isFetchingCourses"
     infinite-scroll-offset="100">
     </div>
     */
    angular
        .module('cls')
        .directive('infiniteScroll', ['$window', infiniteScroll]);

    function infiniteScroll($window) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element, attrs) {
                if (scope.$parent.$ctrl && scope.$parent.$ctrl.summary) {
                    return;
                }

                if (attrs.infiniteScroll !== '' && !scope.$eval(attrs.infiniteScroll)) {
                    return;
                }

                angular.element($window).bind('scroll', function() {
                    var offset = 0;
                    if (attrs.infiniteScrollOffset) {
                        offset = parseInt(attrs.infiniteScrollOffset);
                    }

                    var properties = attrs.infiniteScrollSkip.split('.'),
                        skip = scope.$parent;
                    properties.forEach(function(p) {
                        skip = skip[p];
                    });

                    if (!skip) {
                        if (this.document.body.clientHeight - this.pageYOffset <=
                            this.document.documentElement.clientHeight + offset) {
                            scope.$apply('$parent.' + attrs.onScrollEnd);
                        }
                    }
                });
            }
        };
    }
})();

