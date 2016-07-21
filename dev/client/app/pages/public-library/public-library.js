(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:PublicLibraryCtrl
     * @description
     * Controller for public library page. Shows search result from public home page search box
     *
     */
    angular
        .module('cls')
        .controller('PublicLibraryCtrl', ['$rootScope', '$state', '$scope', '$stateParams',
                                          'courseService', PublicLibraryCtrl]);

    function PublicLibraryCtrl($rootScope, $state, $scope, $stateParams, courseService) {
        if ($stateParams.searchText) {
            $scope.searchText = $stateParams.searchText;
            $rootScope.searchText = $stateParams.searchText;
        } else if ($rootScope.searchText) {
            $scope.searchText = $rootScope.searchText;
            $stateParams.searchText = $rootScope.searchText;
        }

        if ($stateParams.isUserAuthenticated === 'true' ||
           $stateParams.isUserAuthenticated === true) {
            $scope.courseFetchServiceCall = function(startIndex, numOfCoursesToFetch) {
                return courseService.privateSearchCourses(startIndex, numOfCoursesToFetch,
                    $scope.searchText);
            };
            $scope.privateSearch = true;
        } else {
            $scope.brandId = $stateParams.searchObject ? ($stateParams.searchObject.bId ?
                                $stateParams.searchObject.bId : 0) : 0;
            $scope.industryId = $stateParams.searchObject ? ($stateParams.searchObject.indId ?
                                $stateParams.searchObject.indId : 0) : 0;

            $scope.courseFetchServiceCall = function(startIndex, numOfCoursesToFetch) {
                return courseService.searchCourses($scope.searchText, startIndex, numOfCoursesToFetch, $scope.brandId,
                        $scope.industryId);
            };
            $scope.privateSearch = false;
        }

        $scope.redirectBack = function() {
            $rootScope.searchText = '';
            $state.go('home');
        };

        $scope.privateRedirectBack = function() {
            $rootScope.searchText = '';
            $state.go('user.dashboard');
        };
    }
})();
