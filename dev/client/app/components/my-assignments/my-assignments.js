(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:myAssignments
     * @restrict E
     *
     * @description
     * Component to show a my assignments
     *
     * @param {int} summary 1 if it should be shown in as summary view in dashboard page, else 0 or skip the attribute
     * @param {int} rows Number of rows of assignments to show
     * @param {string} title Title of My Assignment component
     * @param {string} desc Description of My Assignment component to be shown under title
     *
     * @example
     <my-assignments ng-if="zone.name == 'assignments'" summary="1" rows="{{ zone.rows }}" title="{{ zone.title }}"
     desc="{{ zone.desc }}"></my-assignments>
     */
    angular
        .module('cls')
        .controller('MyAssignmentsCtrl',
            ['$rootScope', '$scope', '$window', '$state', '$stateParams', 'arrayHelpers',
                'appConfig', 'programService', 'appSettingsService',
                MyAssignmentsCtrl])
        .component('myAssignments', {
            bindings: {
                summary: '@',
                rows: '@',
                title: '@',
                desc: '@'
            },
            controller: 'MyAssignmentsCtrl',
            templateUrl: 'app/components/my-assignments/my-assignments.tmpl.html'
        });

    function MyAssignmentsCtrl($rootScope, $scope, $window, $state, $stateParams, arrayHelpers,
                               appConfig, programService, appSettingsService) {
        var vm = this;
        vm.sortValues = [{
            key: 'Alphabetical',
            val: 'pNm'
        }, {
            key: 'Start Date',
            val: 'sDt'
        }, {
            key: 'Expiring',
            val: 'eDt'
        }];
        $scope.sortVal = 'eDt';

        vm.isFetchingAssignments = true;
        vm.infiniteScrollFetchAssignment = vm.summary === '1' ? '0' : '*';
        vm.infiniteScrollShowAssignment = appConfig.userHomePage.infiniteScrollItemsToRender;
        vm.totalRenderedAssignment = 0;
        vm.infiniteScrollFetch = -1;
        vm.rows = parseInt(vm.rows);

        vm.isSummary = function() {
            return vm.summary === '1';
        };
        vm.shallInfiniteScroll = !vm.isSummary();

        if ($stateParams.title) {
            vm.title = $stateParams.title;
            vm.desc = $stateParams.desc;
            vm.rows = $stateParams.rows;
        }

        appSettingsService.getZoneSettings()
            .then(function(settings) {
                settings.layPref.forEach(function(layout) {
                    if (layout.id === 1) {  // assignments
                        vm.title = layout.zn;
                        vm.desc = layout.desc;
                        vm.rows = layout.nRow;
                    }
                });
            });


        var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
        vm.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);
        vm.rowsToRender = vm.rows;
        if (vm.rows === 0 || isNaN(vm.rows)) {
            vm.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;
        }
        vm.cardContainerWidth = appConfig.layout.cardWidth * vm.cols;
        appConfig.layout.containerWidthChanged = vm.cardContainerWidth;

        vm.latestAssignmentRows = [];
        var numberOfAssignmentsToShowInOneBatch = vm.rowsToRender * vm.cols,
            numOfAssignmentsToFetch = vm.shallInfiniteScroll ? -1 : numberOfAssignmentsToShowInOneBatch;
        vm.isEndOfResult = false;

        programService.getLatestMyAssignments(numOfAssignmentsToFetch)
            .then(function(assignments) {
                if (assignments.assignArr) {
                    vm.latestAssignments = assignments.assignArr;
                    if (assignments.tCnt === 0) {
                        vm.isNoResultFound = true;
                    }
                    vm.totalCount = assignments.tCnt;
                    // If total assignments can fit in 1 row than rowsToRender,
                    // should be less than 1 only in order to show end of result on See All page.
                    if (vm.totalCount + vm.cols <= numberOfAssignmentsToShowInOneBatch) {
                        vm.rowsToRender -= 1;
                        numberOfAssignmentsToShowInOneBatch = vm.totalCount;
                    }
                    if (vm.totalCount <= numberOfAssignmentsToShowInOneBatch) {
                        vm.totalRenderedAssignment = vm.totalCount;
                    } else {
                        vm.totalRenderedAssignment = numberOfAssignmentsToShowInOneBatch;
                    }

                    // vm.totalRenderedAssignment = numberOfAssignmentsToShowInOneBatch;
                    vm.latestAssignmentRows = [];
                    for (var r = 0; r < vm.rowsToRender; r++) {
                        vm.latestAssignmentRows.push(vm.latestAssignments.slice(r * vm.cols, (r + 1) * vm.cols));
                    }

                    if (vm.latestAssignments.length <= vm.totalRenderedAssignment) {
                        vm.isEndOfResult = true;
                    }
                    vm.isFetchingAssignments = false;
                } else {
                    vm.totalCount = 0;
                    vm.isNoResultFound = true;
                    vm.isFetchingAssignments = false;
                }
            });

        $rootScope.$on('resetDetailsIndex', function(event, parent) {
            if (parent === 'assignments') {
                $scope.$broadcast('disableDetails');
            }
        });

        vm.seeAll = function() {
            $state.go('user.assignments', {title: vm.title, desc: vm.desc});
        };

        vm.getMoreAssignments = function() {
            if (!vm.shallInfiniteScroll) {
                return;
            }

            if (vm.totalRenderedAssignment < vm.latestAssignments.length) {
                vm.isFetchingAssignments = true;
                vm.totalRenderedAssignment += numberOfAssignmentsToShowInOneBatch;
                var existingRowsCount = vm.rowsToRender;
                vm.rowsToRender = parseInt(vm.totalRenderedAssignment / vm.cols);
                for (var r = existingRowsCount; r < vm.rowsToRender; r++) {
                    vm.latestAssignmentRows.push(
                        vm.latestAssignments.slice(r * vm.cols, (r + 1) * vm.cols));
                }
                if (vm.totalRenderedAssignment >= vm.latestAssignments.length) {
                    vm.totalRenderedAssignment = vm.latestAssignments.length;
                    vm.isEndOfResult = true;
                }
                vm.isFetchingAssignments = false;
            } else {
                if (vm.infiniteScrollFetch !== -1) {
                    vm.isFetchingAssignments = true;
                    programService.getNextAssignments(vm.latestAssignments.length,
                        vm.infiniteScrollFetchAssignment)
                        .then(function(assignment) {
                            vm.latestAssignments.push.apply(vm.latestAssignments,
                                assignment.assignArr);
                            vm.totalCount += assignment.tCnt;
                            vm.totalRenderedAssignment += numberOfAssignmentsToShowInOneBatch;
                            vm.latestAssignmentRows = [];
                            // TODO: Take upper limit for rows in infinite scroll rather than parseInt.
                            vm.rowsToRender = parseInt(vm.totalRenderedAssignment / vm.cols);
                            for (var r = 0; r < vm.rowsToRender; r++) {
                                vm.latestAssignmentRows.push(
                                    vm.latestAssignments.slice(r * vm.cols, (r + 1) * vm.cols));
                            }
                            vm.isFetchingAssignments = false;
                        });
                }
            }
        };

        vm.sortOrderChange = function(sortParam) {
            var currDt = new Date(), inProgressArr = [], restProgArr = [], sDt, eDt, iRange;
            if (sortParam === 'eDt') {
                vm.latestAssignments.forEach(function(obj, i) {
                    sDt = new Date(vm.latestAssignments[i].sDt);
                    eDt = new Date(vm.latestAssignments[i].eDt);
                    iRange = currDt >= sDt && currDt <= eDt;
                    if (iRange) {
                        inProgressArr.push (vm.latestAssignments[i]);
                    } else {
                        restProgArr.push(vm.latestAssignments[i]);
                    }
                });
                inProgressArr.forEach(function(obj, i) {
                    inProgressArr[i].eDt  = new Date(obj.eDt).toISOString();
                });
                restProgArr.forEach(function(obj, i) {
                    restProgArr[i].eDt  = new Date(obj.eDt).toISOString();
                });
                arrayHelpers.sort(inProgressArr, sortParam);
                arrayHelpers.sort(restProgArr, sortParam);
                vm.latestAssignments = inProgressArr.concat(restProgArr);
            } else if (sortParam === 'sDt') {
                vm.latestAssignments.forEach(function(obj, i) {
                    vm.latestAssignments[i].sDt  = new Date(obj.sDt).toISOString();
                });
                arrayHelpers.sort(vm.latestAssignments, sortParam);
            } else {
                arrayHelpers.sort(vm.latestAssignments, sortParam);
            }
            vm.latestAssignmentRows = [];
            for (var r = 0; r < vm.rowsToRender; r++) {
                vm.latestAssignmentRows.push(vm.latestAssignments.slice(r * vm.cols, (r + 1) * vm.cols));
            }
            vm.totalCount = vm.latestAssignments.length;
        };
    }
})();
