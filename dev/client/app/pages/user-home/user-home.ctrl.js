(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:UserHomeCtrl
     * @description Controller for user home page. Shows user dashboard and
     *              other zones
     */
    angular.module('cls').controller('UserHomeCtrl', ['$rootScope', UserHomeCtrl]);

    function UserHomeCtrl($rootScope) {
        // var vm = this;
        $rootScope.searchText = '';
    }
})();
