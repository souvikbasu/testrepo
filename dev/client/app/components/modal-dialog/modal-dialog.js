(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:modalDialog
     * @restrict E
     *
     * @description
     * Shows a Modal dialog box
     *
     * @param {boolean} show Expression to show the modal dialog
     * @param {boolean} showCloseButtonAtBottom Expression to show extra close button at bottom
     * @param {string} closeButtonCaption Extra close button caption
     * @param {string} width Optional param to set specific width
     * @param {string} height Optional param to set specific height
     * @param {string} title Optional param to set dialog title
     * @example
     <modal-dialog></modal-dialog>
     */
    angular
        .module('cls')
        .controller('ModalDialogCtrl', ['$window', ModalDialogCtrl])
        .component('modalDialog', {
            bindings: {
                show: '=',
                showCloseButtonAtBottom: '=',
                closeButtonCaption: '@',
                width: '@',
                height: '@',
                title: '@'
            },
            controller: 'ModalDialogCtrl',
            templateUrl: 'app/components/modal-dialog/modal-dialog.tmpl.html',
            transclude: true
        });

    function ModalDialogCtrl($window) {
        var vm = this;

        vm.hide = function() {
            vm.show = false;
        };

        vm.panelHeight = vm.height && vm.height.substr(0, vm.height.length - 2) <= ($window.innerHeight - 20) ?
            vm.height
            : ($window.innerHeight - 20) + 'px';
        vm.panelWidth = vm.width && vm.width.substr(0, vm.width.length - 2) <= ($window.innerWidth - 20) ?
            vm.width
            : ($window.innerWidth - 20) + 'px';

        vm.transcludeHeight = vm.showCloseButtonAtBottom ?  $window.innerHeight - 190 : $window.innerHeight - 120;
    }
})();
