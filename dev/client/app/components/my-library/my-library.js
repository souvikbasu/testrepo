(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:myLibrary
     * @restrict E
     * @description Component to show a my library
     * @param {int}
     *            summary 1 if it should be shown in as summary view in
     *            dashboard page, else 0 or skip the attribute
     * @param {int}
     *            rows Number of rows of courses to show
     * @param {string}
     *            title Title of My Library component
     * @param {string}
     *            desc Description of My Library component to be shown under
     *            title
     *
     * @example <my-library rows="4" title="Library Search" desc="Search result"></my-library>
     */
    angular.module('cls').controller(
        'MyLibraryCtrl',
        ['$scope', '$window', '$state', '$stateParams', 'appConfig', 'appSettingsService', 'courseService',
            MyLibraryCtrl])
        .component('myLibrary', {
            bindings: {
                summary: '@',
                rows: '@',
                title: '@',
                desc: '@'
            },
            controller: 'MyLibraryCtrl',
            templateUrl: 'app/components/my-library/my-library.tmpl.html'
        });

    function MyLibraryCtrl($scope, $window, $state, $stateParams, appConfig, appSettingsService, courseService) {
        var vm = this;

        vm.infiniteScrollFetch = vm.summary === '1' ? '0' : '*';
        vm.infiniteScrollShow = appConfig.userHomePage.infiniteScrollItemsToRender;
        vm.totalRendered = 0;

        if ($stateParams.title) {
            vm.title = $stateParams.title;
            vm.desc = $stateParams.desc;
            vm.rows = $stateParams.rows;
        }

        vm.totalCountBeforeFilter = vm.totalCount;

        if (vm.title == null) {
            appSettingsService.getZoneSettings().then(function(settings) {
                settings.layPref.forEach(function(layout) {
                    if (layout.id === 2) { // library
                        vm.title = layout.zn;
                        vm.desc = layout.desc;
                        vm.rows = layout.nRow;
                    }
                });
            });
        }

        var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
        vm.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);
        vm.displayLibraryCount = 2 * vm.cols;
        vm.cardContainerWidth = appConfig.layout.cardWidth * vm.cols;
        appConfig.layout.containerWidthChanged = vm.cardContainerWidth;

        vm.isSummary = function() {
            return vm.summary === '1';
        };

        vm.seeAll = function() {
            $state.go('user.library', {
                title: vm.title,
                desc: vm.desc
            });
        };

        $scope.$on('updateLibraryCount', function(event, totalCount, isFilterApplied) {
            vm.totalCount = totalCount;
            vm.isFilterApplied = isFilterApplied;
        });

        $scope.$on('updateLibraryCountBeforeFilter',
                   function(event, totalCountBeforeFilter) {
            vm.totalCountBeforeFilter = totalCountBeforeFilter;
            if (parseInt(vm.totalCountBeforeFilter) <= parseInt(vm.displayLibraryCount)) {
                vm.displayLibraryCount = vm.totalCountBeforeFilter;
            }
        });

        $scope.$on('courseListUpdated', function(event, courses) {
            vm.totalRendered = courses.length;
            if (event.stopPropagation) { // only emit can be stopped, broadcast cannot be
                event.stopPropagation();
            }
        });

        vm.courseFetchServiceCall = function(startIndex, numOfCoursesToFetch) {
            return courseService.getLibraryCourses(startIndex, numOfCoursesToFetch);
        };
    }
})();
