(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:clsFooter
     * @restrict E
     *
     * @description
     * Footer component to show all links
     *
     * @example
         <cls-footer></cls-footer>
     */
    angular
        .module('cls')
        .controller('FooterCtrl', ['appConfig', FooterCtrl])
        .component('clsFooter', {
            bindings: {
                termsofuse: '@'
            },
            controller: 'FooterCtrl',
            templateUrl: 'app/components/cls-footer/cls-footer.tmpl.html'
        });

    function FooterCtrl(appConfig) {
        var vm = this;

        if (vm.termsofuse === 'ds-tnc') {
            vm.tnc = appConfig.serviceEndPoints.dsTnc;
        } else if (vm.termsofuse === 'public-tnc') {
            vm.tnc = appConfig.serviceEndPoints.publicTnc;
        } else {
            vm.tnc = '';
        }
    }
})();
