(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:myFavorites
     * @restrict E
     * @description Component to show a my favorites
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
     * @example <my-favorites rows="4" title="My Favorites" desc="My Favorites"></my-favorites>
     */

    angular.module('cls').controller(
        'MyFavoritesCtrl',
        ['$rootScope', '$scope', '$window', '$state', '$stateParams',
         'appConfig', 'courseService', 'appSettingsService',
           'arrayHelpers', MyFavoritesCtrl]).component('myFavorites', {
        bindings: {
            summary: '@',
            rows: '@',
            title: '@',
            desc: '@'
        },
        controller: 'MyFavoritesCtrl',
        templateUrl: 'app/components/my-favorites/my-favorites.tmpl.html'
    });

    function MyFavoritesCtrl($rootScope, $scope, $window, $state,
                             $stateParams, appConfig, courseService, appSettingsService, arrayHelpers) {
        var vm = this, sortArr = [];
        vm.sortValues = [{
            key: 'Alphabetical',
            val: 'cT'
        }, {
            key: '% Completion',
            val: 'perComp'
        }, {
            key: 'Recently Added',
            val: 'aDt'
        }, {
            key: 'Recently Accessed',
            val: 'eDt'
        }];
        $scope.sortVal = 'eDt';

        vm.infiniteScrollFetchFavorites = vm.summary === '1' ? '0' : '*';
        vm.infiniteScrollShowFavorites = appConfig.userHomePage.infiniteScrollItemsToRender;
        vm.isFetchingFavorites = true;
        vm.totalRenderedFavorites = 0;
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

        if (vm.title == null) {
            appSettingsService.getZoneSettings().then(function(settings) {
                settings.layPref.forEach(function(layout) {
                    if (layout.id === 4) {// favorites
                        vm.title = layout.zn;
                        vm.desc = layout.desc;
                        vm.rows = layout.nRow;
                    }
                });
            });
        }

        var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
        vm.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);
        if (vm.cols < 2) {
            vm.cols = 2;
        }

        vm.rowsToRender = vm.rows;
        if (vm.rows === 0 || isNaN(vm.rows)) {
            vm.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;  // 860 is
        }
        vm.cardContainerWidth = appConfig.layout.cardWidth * vm.cols;
        appConfig.layout.containerWidthChanged = vm.cardContainerWidth;

        vm.latestCourseRows = [];
        var numberOfFavCoursesToShowInOneBatch = vm.rowsToRender * vm.cols,
            numOfFavCoursesToFetch = vm.shallInfiniteScroll ? -1 : numberOfFavCoursesToShowInOneBatch;
        vm.isEndOfResult = false;

        courseService.getTopFavoriteCourses(numOfFavCoursesToFetch)
            .then(function(courses) {
                if (courses.favArr) {
                    vm.latestCourses = courses.favArr;
                    if (courses.tCnt === 0) {
                        vm.isNoResultFound = true;
                    }
                    vm.totalCount = courses.tCnt;
                    if (vm.totalCount + vm.cols <= numberOfFavCoursesToShowInOneBatch) {
                        vm.rowsToRender -= 1;
                        numberOfFavCoursesToShowInOneBatch = vm.totalCount;
                    }
                    if (vm.totalCount <= numberOfFavCoursesToShowInOneBatch) {
                        vm.totalRenderedFavorites = vm.totalCount;
                    } else {
                        vm.totalRenderedFavorites = numberOfFavCoursesToShowInOneBatch;
                    }
                    // vm.totalRenderedFavorites = numberOfFavCoursesToShowInOneBatch;

                    vm.latestCourseRows = [];
                    for (var r = 0; r < vm.rowsToRender; r++) {
                        vm.latestCourseRows.push(vm.latestCourses.slice(r * vm.cols, (r + 1) * vm.cols));
                    }

                    if (vm.latestCourses.length <= vm.totalRenderedFavorites) {
                        vm.isEndOfResult = true;
                    }
                    vm.isFetchingFavorites = false;
                } else {
                    vm.totalCount = 0;
                    vm.isNoResultFound = true;
                    vm.isFetchingFavorites = false;
                }
            });

        $scope.$on('updateFavorites', function() {
            var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
            vm.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);
            vm.rowsToRender = vm.rows;
            if (vm.rows === 0 || isNaN(vm.rows)) {
                vm.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;  // 860 is
            }
            vm.cardContainerWidth = appConfig.layout.cardWidth * vm.cols;
            appConfig.layout.containerWidthChanged = vm.cardContainerWidth;

            vm.latestCourseRows = [];
            var numberOfFavCoursesToShowInOneBatch = vm.rowsToRender * vm.cols,
                numOfFavCoursesToFetch = vm.shallInfiniteScroll ? -1 : numberOfFavCoursesToShowInOneBatch;
            vm.isEndOfResult = false;

            courseService.getTopFavoriteCourses(numOfFavCoursesToFetch)
            .then(function(courses) {
                if (courses.tCnt === 0) {
                    vm.isNoResultFound = true;
                } else {
                    vm.isNoResultFound = false;
                }
                vm.latestCourses = courses.favArr;
                vm.totalCount = courses.tCnt;
                if (vm.totalCount + vm.cols <= numberOfFavCoursesToShowInOneBatch) {
                    vm.rowsToRender -= 1;
                    numberOfFavCoursesToShowInOneBatch = vm.totalCount;
                }
                if (vm.totalCount <= numberOfFavCoursesToShowInOneBatch) {
                    vm.totalRenderedFavorites = vm.totalCount;
                } else {
                    vm.totalRenderedFavorites = numberOfFavCoursesToShowInOneBatch;
                }
                // vm.totalRenderedFavorites = numberOfFavCoursesToShowInOneBatch;
                vm.latestCourseRows = [];
                for (var r = 0; r < vm.rowsToRender; r++) {
                    vm.latestCourseRows.push(vm.latestCourses.slice(r * vm.cols, (r + 1) * vm.cols));
                }

                if (vm.latestCourses.length <= vm.totalRenderedFavorites) {
                    vm.isEndOfResult = true;
                }
                vm.isFetchingFavorites = false;
            });
        });

        vm.onCourseListUpdated = function() {
            vm.latestCourseRows = [];
            for (var r = 0; r < vm.rowsToRender; r++) {
                vm.latestCourseRows.push(vm.latestCourses.slice(r * vm.cols, (r + 1) * vm.cols));
            }
            $scope.$emit('courseListUpdated', vm.latestCourses);
        };

        vm.getMoreCourses = function() {
            if (!vm.shallInfiniteScroll) {
                return;
            }
            if (vm.totalRenderedFavorites < vm.latestCourses.length) {
                vm.isFetchingFavorites = true;
                vm.totalRenderedFavorites += numberOfFavCoursesToShowInOneBatch;
                var existingRowsCount = vm.rowsToRender;
                vm.rowsToRender = parseInt(vm.totalRenderedFavorites / vm.cols);
                for (var r = existingRowsCount; r < vm.rowsToRender; r++) {
                    vm.latestCourseRows.push(vm.latestCourses.slice(r * vm.cols, (r + 1) * vm.cols));
                }
                if (vm.totalRenderedFavorites >= vm.latestCourses.length) {
                    vm.totalRenderedFavorites = vm.latestCourses.length;
                    vm.isEndOfResult = true;
                }
                vm.isFetchingFavorites = false;
            } else {
                if (vm.infiniteScrollFetch !== -1) {
                    console.log('if');
                    vm.isFetchingFavorites = true;
                    courseService.getNextFavoriteCourses(vm.latestCourses.length,
                        vm.infiniteScrollFetchFavorites)
                        .then(function(courses) {
                            vm.latestCourses.push.apply(vm.latestCourses, courses.favArr);
                            vm.totalCount += courses.tCnt;
                            vm.totalRenderedFavorites += numberOfFavCoursesToShowInOneBatch;
                            vm.isFetchingFavorites = false;
                            vm.latestCourseRows = [];
                            // TODO: Take upper limit for rows in infinite scroll rather than parseInt.
                            vm.rowsToRender = parseInt(vm.totalRenderedFavorites / vm.cols);
                            for (var r = 0; r < vm.rowsToRender; r++) {
                                vm.latestCourseRows.push(vm.latestCourses.slice(r * vm.cols, (r + 1) * vm.cols));
                            }
                        });
                }
            }
        };

        vm.isSummary = function() {
            return vm.summary === '1';
        };

        vm.seeAll = function() {
            $state.go('user.favorites', {
                title: vm.title,
                desc: vm.desc
            });
        };

        vm.sortOrderChange = function(sortParam) {
            if (sortParam === 'aDt') {
                vm.latestCourses.forEach(function(obj, i) {
                    vm.latestCourses[i].aDt  = new Date(obj.aDt).toISOString();
                });
                arrayHelpers.sort(vm.latestCourses, sortParam);
                sortArr = vm.latestCourses.reverse();
            } else if (sortParam === 'eDt') {
                vm.latestCourses.forEach(function(obj, i) {
                    vm.latestCourses[i].eDt  = new Date(obj.eDt).toISOString();
                });
                arrayHelpers.sort(vm.latestCourses, sortParam);
                sortArr = vm.latestCourses.reverse();
            } else if (sortParam === 'perComp') {
                sortArr = vm.latestCourses.sort(arrayHelpers.sortByNumProperty(sortParam));
            } else if (sortParam === 'cT') {
                arrayHelpers.sort(vm.latestCourses, sortParam);
                sortArr = vm.latestCourses;
            }
            vm.latestCourseRows = [];
            for (var r = 0; r < vm.rowsToRender; r++) {
                vm.latestCourseRows.push(sortArr.slice(r * vm.cols, (r + 1) * vm.cols));
            }
            vm.totalCount = sortArr.length;
        };

        vm.removeFavorites = function(lobjId, favFlag) {
            removeElementFromArray(vm.latestCourses,lobjId);
            courseService.addRemoveFav(lobjId, favFlag).then(function() {
                $rootScope.$broadcast('updateLibrary');
                // $rootScope.$broadcast('updateFavorites');
            });
            vm.totalRendered = vm.latestCourses.length;
            vm.latestCourseRows = [];
            if (vm.rows === '0') {  // TODO: need to fix this check. Do not know why we get rows as "0" here
                vm.rows = parseInt(vm.totalRendered / vm.cols);
            }
            for (var r = 0; r < vm.rows; r++) {
                vm.latestCourseRows.push(vm.latestCourses.slice(r * vm.cols, (r + 1) * vm.cols));
            }
            $scope.$emit('courseListUpdated', vm.latestCourses);
        };

        function removeElementFromArray(arrayObj,element) {
            var indexToRemove = -1;
            arrayObj.forEach(function(obj, i) {
                if (obj.lObjId === element) {
                    indexToRemove = i;
                }
            });

            if (indexToRemove !== -1) {
                arrayObj.splice(indexToRemove,1);
            }

            // for updating course count and total count
            var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
            vm.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);
            vm.rowsToRender = vm.rows;
            if (vm.rows === 0 || isNaN(vm.rows)) {
                vm.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;  // 860 is
            }
            var numberOfFavCoursesToShowInOneBatch = vm.rowsToRender * vm.cols;
            vm.isEndOfResult = false;
            vm.totalCount = arrayObj.length;
            if (vm.totalCount <= numberOfFavCoursesToShowInOneBatch) {
                vm.totalRenderedFavorites = vm.totalCount;
            } else {
                vm.totalRenderedFavorites = numberOfFavCoursesToShowInOneBatch;
            }

            // for updating 'no result found' msg
            if (vm.totalCount === 0) {
                vm.isNoResultFound = true;
            } else {
                vm.isNoResultFound = false;
            }
        }
    }
})();
