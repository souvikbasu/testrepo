(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:clsStaticHeader
     * @restrict E
     *
     * @description Header component to show in all pages
     *
     * @example <cls-static-header></cls-static-header>
     */
    angular.module('cls').controller('ClsStaticHeaderCtrl', ['$state', ClsStaticHeaderCtrl]).component(
            'clsStaticHeader', {
                bindings: {},
                controller: 'ClsStaticHeaderCtrl',
                templateUrl: 'app/components/cls-static-header/cls-static-header.tmpl.html'
            });

    function ClsStaticHeaderCtrl($state) {
        var vm = this;

        vm.companionHome = function() {
            $state.go('home');
        };
    }
})();
