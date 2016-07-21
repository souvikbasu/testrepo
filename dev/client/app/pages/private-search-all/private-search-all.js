(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:PrivateSearchAllCtrl
     * @description Controller for Private search all tab. Shows all results
     *              from search string and allows to launch a particular string
     */
    angular.module('cls').controller('PrivateSearchAllCtrl',
            ['$state', '$rootScope', '$scope', '$stateParams', 'appConfig',
             '$window', 'courseService', 'arrayHelpers', PrivateSearchAllCtrl]);

    function PrivateSearchAllCtrl($state, $rootScope, $scope, $stateParams,
                                   appConfig, $window, courseService,
                                   arrayHelpers) {
        var courseFetch,
            pageIndex = 1,
            updateFiltersFromSelectedFilters,
            createfCriteria,
            searchFilters = [];

        $scope.shallInfiniteScroll = true;
        $scope.isFetchingCourses = false;
        $scope.isEndOfResult = false;
        $scope.fCriteria = '';
        $scope.courses = [];
        $scope.exaleadFiltersObj = {};
        $scope.rows = 2;
        $scope.selectedExaleadFilters = [];
        $scope.selectedExaleadBrands = [];
        $scope.selectedExaleadVersions = [];
        $scope.selectedExaleadScreenType = [];
        $scope.selectedExaleadLanguages = [];
        $scope.selectedExaleadDiscipline = [];

        $scope.searchText = $stateParams.searchText;

        if ($stateParams.searchFilters) {
            searchFilters = $stateParams.searchFilters;
        }

        updateFiltersFromSelectedFilters = function() {
            if ($scope.selectedExaleadFilters[0]) {
                $scope.selectedExaleadFilters.forEach(function(item) {
                    if (item.category === 'brands') {
                        $scope.selectedExaleadBrands.push(item.details);
                    } else if (item.category === 'vers') {
                        $scope.selectedExaleadVersions.push(item.details);
                    } else if (item.category === 'inds') {
                        $scope.selectedExaleadScreenType.push(item.details);
                    } else if (item.category === 'lvl') {
                        $scope.selectedExaleadLanguages.push(item.details);
                    } else if (item.category === 'langs') {
                        $scope.selectedExaleadDiscipline.push(item.details);
                    }
                });
            }
        };

        $scope.updateTickedValueForEachExaleadFilter = function() {
            $scope.exaleadFilters[0].filters.forEach(function(brand) {
                brand.isSelected = false;
                if ($scope.selectedExaleadBrands.length && arrayHelpers.anyMatch
                    ($scope.selectedExaleadBrands, [brand], 'fNm')) {
                    brand.isSelected = true;
                }
            });
            $scope.exaleadFilters[1].filters.forEach(function(version) {
                version.isSelected = false;
                if ($scope.selectedExaleadVersions.length && arrayHelpers.anyMatch
                    ($scope.selectedExaleadVersions, [version], 'fNm')) {
                    version.isSelected = true;
                }
            });
            $scope.exaleadFilters[2].filters.forEach(function(screenType) {
                screenType.isSelected = false;
                if ($scope.selectedExaleadScreenType.length && arrayHelpers.anyMatch
                    ($scope.selectedExaleadScreenType, [screenType], 'fNm')) {
                    screenType.isSelected = true;
                }
            });
            $scope.exaleadFilters[3].filters.forEach(function(language) {
                language.isSelected = false;
                if ($scope.selectedExaleadLanguages.length && arrayHelpers.anyMatch
                    ($scope.selectedExaleadLanguages, [language], 'fNm')) {
                    language.isSelected = true;
                }
            });
            $scope.exaleadFilters[4].filters.forEach(function(discipline) {
                discipline.isSelected = false;
                if ($scope.selectedExaleadDiscipline.length && arrayHelpers.anyMatch
                    ($scope.selectedExaleadDiscipline, [discipline], 'fNm')) {
                    discipline.isSelected = true;
                }
            });
        };

        $scope.updateSelectedExaleadFilterList = function() {
            $scope.selectedExaleadFilters = [];
            $scope.selectedExaleadBrands.forEach(function(item) {
                $scope.selectedExaleadFilters.push({category: 'brands', details: item});
            });
            $scope.selectedExaleadVersions.forEach(function(item) {
                $scope.selectedExaleadFilters.push({category: 'vers', details: item});
            });
            $scope.selectedExaleadScreenType.forEach(function(item) {
                $scope.selectedExaleadFilters.push({category: 'inds', details: item});
            });
            $scope.selectedExaleadLanguages.forEach(function(item) {
                $scope.selectedExaleadFilters.push({category: 'lvl', details: item});
            });
            $scope.selectedExaleadDiscipline.forEach(function(item) {
                $scope.selectedExaleadFilters.push({category: 'langs', details: item});
            });
        };

        courseFetch = function(filtersCheck) {
            $scope.isFetchingCourses = true;
            $scope.isEndOfResult = false;

            $scope.courses = [];
            $scope.courseRows = [];
            pageIndex = 1;
            courseService.getAllCourses($rootScope.searchText,
                                        pageIndex,
                                        $scope.fCriteria)
                .then(function(courses) {
                if (courses.courseArr) {
                    if (filtersCheck && (filtersCheck.getFilters === true ||
                                        filtersCheck.getFilters === 'true')) {
                        courseService.getExaleadFilters().
                            then(function(filters) {
                            $scope.exaleadFilters = filters;
                            if ($scope.selectedExaleadFilters[0]) {
                                $scope.updateTickedValueForEachExaleadFilter();
                            }
                        });
                    }
                    pageIndex += 1;
                    $scope.courses = courses.courseArr;

                    // logic: Title should fit in four lines
                    $scope.courses.forEach(function(course) {
                        if (course.cT.length >= 60) {
                            course.cT = course.cT.substring(0, 60).concat('...');
                        }
                    });

                    if (courses.tCnt === 0) {
                        $scope.isNoResultFound = true;
                    }
                    $scope.totalCount = courses.tCnt;
                    $scope.defImage = courses.defImg;
                    if (numberOfCoursesToShowInOneBatch >= $scope.totalCount) {
                        $scope.totalRendered = $scope.totalCount;
                    } else {
                        $scope.totalRendered = numberOfCoursesToShowInOneBatch;
                    }
                    $scope.courseRows = [];
                    for (var r = 0; r < $scope.rowsToRender; r++) {
                        $scope.courseRows.push($scope.courses.slice(r * $scope.cols, (r + 1) *
                                                                    $scope.cols));
                    }
                    if ($scope.totalRendered >= $scope.totalCount) {
                        $scope.isEndOfResultAllTab = true;
                    }
                    $scope.isFetchingCourses = false;
                } else {
                    $scope.isFetchingCourses = false;
                }
            });
        };

        createfCriteria = function() {
            if ($scope.selectedExaleadFilters) {
                $scope.fCriteria = '';
                for (var i = 0; i < $scope.selectedExaleadFilters.length; i++) {
                    if (i !== 0) {
                        $scope.fCriteria += ',';
                    }
                    $scope.fCriteria += $scope.selectedExaleadFilters[i].details.fCriteria;
                }
            }
        };

        $scope.filterChanged = function() {
            $scope.updateSelectedExaleadFilterList();
            createfCriteria();
            courseFetch();
            $scope.updateTickedValueForEachExaleadFilter();
        };

        if ($stateParams.allTabFilters) {
            $scope.selectedExaleadFilters = $stateParams.allTabFilters;
            updateFiltersFromSelectedFilters();
            createfCriteria();
            courseFetch({getFilters: true});
        } else {
            courseFetch({getFilters: true});
        }

        var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
        $scope.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);

        $scope.cardContainerWidth = appConfig.layout.cardWidth * $scope.cols;
        appConfig.layout.containerWidthChanged = $scope.cardContainerWidth;

        $scope.rowsToRender = $scope.rows;
        if ($scope.rows === 0) {
            $scope.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;  // 860 is
            // height of menu
            // bar + title + filters + footer. Add 2 extra rows than calculated
        }
        $scope.courseRows = [];
        var numberOfCoursesToShowInOneBatch = $scope.rowsToRender * $scope.cols;

        $scope.privateRedirectBack = function() {
            $rootScope.searchText = '';
            $state.go('user.dashboard');
        };

        $scope.filterModalVisible = false;
        $scope.toggleFilterModal = function() {
            $scope.filterModalVisible = !$scope.filterModalVisible;
        };

        $scope.selectAllBrands = function() {
            $scope.selectedExaleadBrands = $scope.exaleadFilters[0].filters;
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectNoneBrands = function() {
            $scope.selectedExaleadBrands = [];
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectAllVersions = function() {
            $scope.selectedExaleadVersions = $scope.exaleadFilters[1].filters;
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectNoneVersions = function() {
            $scope.selectedExaleadVersions = [];
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectAllScreenType = function() {
            $scope.selectedExaleadScreenType = $scope.exaleadFilters[2].filters;
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectNoneScreenType = function() {
            $scope.selectedExaleadScreenType = [];
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectAllLanguages = function() {
            $scope.selectedExaleadLanguages = $scope.exaleadFilters[3].filters;
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectNoneLanguages = function() {
            $scope.selectedExaleadLanguages = [];
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectAllDiscipline = function() {
            $scope.selectedExaleadDiscipline = $scope.exaleadFilters[4].filters;
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.selectNoneDiscipline = function() {
            $scope.selectedExaleadDiscipline = [];
            $scope.updateSelectedExaleadFilterList();
            $scope.filterChanged();
        };

        $scope.removeExaleadFilter = function(filter) {
            if (filter.category === 'brands') {
                arrayHelpers.remove($scope.selectedExaleadBrands, filter.details, 'fNm');
            } else if (filter.category === 'vers') {
                arrayHelpers.remove($scope.selectedExaleadVersions, filter.details, 'fNm');
            } else if (filter.category === 'inds') {
                arrayHelpers.remove($scope.selectedExaleadScreenType, filter.details, 'fNm');
            } else if (filter.category === 'lvl') {
                arrayHelpers.remove($scope.selectedExaleadLanguages, filter.details, 'fNm');
            } else if (filter.category === 'langs') {
                arrayHelpers.remove($scope.selectedExaleadDiscipline, filter.details, 'fNm');
            }
            filter.details.isSelected = false;
            $scope.filterChanged(filter.details.fCriteria, true);
        };

        $scope.removeAllExaleadFilters = function() {
            $scope.selectedExaleadBrands = [];
            $scope.selectedExaleadVersions = [];
            $scope.selectedExaleadScreenType = [];
            $scope.selectedExaleadLanguages = [];
            $scope.selectedExaleadDiscipline = [];
            $scope.filterChanged();
        };

        $scope.getMoreCourses = function() {
            if (!$scope.shallInfiniteScroll) {
                return;
            }

            if ($scope.totalRendered >= $scope.totalCount) {
                $scope.isEndOfResultAllTab = true;
                $scope.isFetchingCourses = false;
            } else {
                console.info('Call Server for more courses');
                // if ($scope.infiniteScrollFetch !== '-1') {
                $scope.isFetchingCourses = true;
                courseService.getAllCourses(
                    $rootScope.searchText,
                    pageIndex,
                    $scope.fCriteria
                )
                    .then(function(courses) {
                        pageIndex += 1;
                        $scope.totalCount = courses.tCnt;
                        $scope.courses.push.apply($scope.courses, courses.courseArr);
                        if (numberOfCoursesToShowInOneBatch >= $scope.totalCount) {
                            $scope.totalRendered += $scope.totalCount;
                        } else {
                            $scope.totalRendered += numberOfCoursesToShowInOneBatch;
                        }
                        $scope.rowsToRender = parseInt($scope.totalRendered / $scope.cols);
                        for (var r = 0; r < $scope.rowsToRender; r++) {
                            $scope.courseRows.push(courses.courseArr.slice(r * $scope.cols, (r + 1) * $scope.cols));
                        }
                        $scope.isFetchingCourses = false;
                    });
                // }
            }
        };

        $scope.privateSearchTabSelection = function(tabName) {
            if (tabName === 'courses') {
                $state.go('publicSearch', {searchText: $scope.searchtext,
                                      isUserAuthenticated: true,
                                          allTabFilters: $scope.selectedExaleadFilters,
                                          searchFilters: searchFilters});
            }
        };

        $rootScope.$on('resetSeeMoreResultsIndex', function() {
            $scope.$broadcast('disableSeeMoreResults');
        });
    }
})();
