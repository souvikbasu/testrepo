(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:dsHeader
     * @restrict E
     *
     * @description
     * Header component to show in all pages
     *
     * @example
         <ds-header></ds-header>
     */
    angular
        .module('cls')
        .controller('DsHeaderCtrl', [DsHeaderCtrl])
        .component('dsHeader', {
            bindings: {
            },
            controller: 'DsHeaderCtrl',
            templateUrl: 'app/components/ds-header/ds-header.tmpl.html'
        });

    function DsHeaderCtrl() {
        // var vm = this;
    }
})();
