(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:toasterMessage
     * @restrict E
     *
     * @description Shows a Toaster message
     *
     * @param {string} type warning/info/globalWarning - Type of toaster
     that need to be displayed
     * @param {boolean} showCloseButton Weather you want do allow user to close toaster or not
     * @param {boolean} autoClose Either toaster will automatically get colsed to not
     * @param {int} autoCloseTimer Toaster will get automatically closed in how many mSecs
     * @param {boolean} showTimer Either display timer or not
     * @example <toaster-message type="info" show-close-button="true">
            Display this content...
        </toaster-message>
        <toaster-message type="globalWarning" show-close-button="true">
            This site will not be functional after 1 year.. There will
            be something new for you.. Wait and keep following us till then..
        </toaster-message>
        <toaster-message show-timer="true" auto-close="true"
        auto-close-timer="6000" type="warning" show-close-button="true">
            Display this content...
        </toaster-message>
     */
    angular
        .module('cls')
        .controller('ToasterMessageCtrl', ['$timeout', '$rootScope',
                                           'arrayHelpers', ToasterMessageCtrl])
        .component('toasterMessage', {
            bindings: {
                type: '@',
                globalWarningContent: '=',
                showCloseButton: '@',
                autoClose: '@',
                autoCloseTimer: '@',
                showTimer: '@'
            },
            controller: 'ToasterMessageCtrl',
            templateUrl: 'app/components/toaster-message/toaster-message.tmpl.html',
            transclude: true
        });

    function ToasterMessageCtrl($timeout, $rootScope, arrayHelpers) {
        var vm = this,
            mytimeout,
            onTimeout,
            startTimer,
            toasterType = ['warning', 'info', 'globalWarning'];

        vm.type = arrayHelpers.containsIn(toasterType, vm.type) === true ? vm.type : 'info';
        vm.isClosed = false;
        vm.closeToaster = function() {
            vm.isClosed = true;
        };

        vm.readMoreGlobalWarning = function() {
            $rootScope.$emit('enableReadMoreGlobalWarningModal');
        };

        if (vm.autoCloseTimer) {
            vm.autoCloseTimer = parseInt(vm.autoCloseTimer) || 2000;
            vm.timer = vm.autoCloseTimer / 1000;
        }

        if (!vm.autoClose) {
            vm.showTimer = false;
            vm.autoCloseTimer = false;
        }

        if (vm.autoClose === true || vm.autoClose === 'true') {
            startTimer = function() {
                mytimeout = $timeout(onTimeout, 1000);
            };
            onTimeout = function() {
                if (vm.timer ===  0) {
                    $timeout.cancel(mytimeout);
                    return;
                }
                vm.timer--;
                mytimeout = $timeout(onTimeout, 1000);
            };
            startTimer();
            $timeout(function() {
                vm.closeToaster();
            }, vm.autoCloseTimer);
        }
        // $rootScope.toasterArray.push($rootScope.toasterArray.length);
    }
})();
