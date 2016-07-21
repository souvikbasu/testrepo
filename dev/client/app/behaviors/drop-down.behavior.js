(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:dropDown
     * @restrict A
     * @description Implements dropdown functionality
     * @param {ng Expression} callbackFn Controller function to be called for
     *        toggling the dropdown list
     *
     * @example <div callback-fn="toggleMenuPanel(param)" drop-down>
     */
    angular.module('cls').directive('dropDown', ['$document', 'arrayHelpers', dropDown]);

    function dropDown($document, arrayHelpers) {
        return {
            restrict: 'A',
            scope: {
                callbackFn: '&'
            },
            link: function(scope, element) {
                $document.bind('click', function(event) {
                    var isClickedElementChildOfPopup, children;

                    children = element[0].getElementsByTagName('*');
                    isClickedElementChildOfPopup = arrayHelpers.containsIn(children, event.target);

                    if (isClickedElementChildOfPopup) {
                        return;
                    }

                    scope.callbackFn({
                        param: false
                    });
                    scope.$apply();
                });
            }
        };
    }
})();
