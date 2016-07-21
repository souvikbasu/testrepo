(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:defaultImage
     * @restrict A
     * @description Implements defaultImage functionality
     * @param {string} defImg default image to be shown in case of image load failure
     *
     * @example <div def-img="img_path" default-image>
     */
    angular.module('cls').directive('defaultImage', ['$q', DefaultImage]);

    function DefaultImage($q) {
        return {
            restrict: 'A',
            scope: {
                defImg: '@'
            },
            link: function(scope, element, attrs) {
                attrs.$observe('ngSrc', function(ngSrc) {
                    var deferred = $q.defer(), image;
                    image = new Image();
                    image.onerror = function() {
                        deferred.resolve(false);
                        element.attr('src', scope.defImg);
                    };
                    image.onload = function() {
                        deferred.resolve(true);
                    };
                    image.src = ngSrc;
                    return deferred.promise;
                });
            }
        };
    }
})();
