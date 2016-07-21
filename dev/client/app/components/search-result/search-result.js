(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:searchResult
     * @restrict E
     *
     * @description
     * Component to show a search result with filters
     *
     * @param {Boolean} showTitle Boolean to show title or not
     * @param {Boolean} showFilter Boolean to show filter or not
     * @param {Boolean} shallInfiniteScroll Boolean to indicate whether to infinite scroll or not
     * @param {Boolean} showBlueBg Boolean to show blue background
     * @param {int} rows Number of rows of courses to show
     * @param {int} infiniteScrollFetch Number of courses to fetch when user scrolld down. A special value of -1
     * means get all courses at once
     * @param {string} filterType <ul>
     *                              <li>predefined: Show predefined hard coded filters</li>
     *                              <li>dynamic: Create filter dynamically from search result</li>
     *                            </ul>
     *
     * @example
     <search-result show-title="false" show-filter="!$ctrl.isSummary()" shall-infinite-scroll="!$ctrl.isSummary()"
     show-blue-bg="$ctrl.isSummary()" rows="{{ $ctrl.rows }}" filter-type="dynamic" infinite-scroll-fetch="-1">
     </search-result>
     */
    angular
        .module('cls')
        .controller('SearchResultCtrl',
            ['$rootScope', '$scope', '$stateParams', '$state',
             '$window', '$log', 'appConfig', 'courseService', 'arrayHelpers',
                SearchResultCtrl])
        .component('searchResult', {
            bindings: {
                showTitle: '=',
                searchText: '@',
                showFilter: '=',
                shallInfiniteScroll: '=',
                showBlueBg: '=',
                courseFetchServiceCall: '&',
                rows: '@',
                filterType: '@',
                infiniteScrollFetch: '@',
                fromLibrary: '@',
                isPrivateSearch: '@'
            },
            controller: 'SearchResultCtrl',
            templateUrl: 'app/components/search-result/search-result.tmpl.html'
        });

    function SearchResultCtrl($rootScope, $scope, $stateParams, $state,
                               $window, $log, appConfig, courseService, arrayHelpers) {
        var vm = this,
            filteredCards = [],
            sortArr = [],
            courseFetch,
            allTabFilters = [];

        vm.sortValues = [{
            key: 'Alphabetical',
            val: 'cT'
        }, {
            key: '% Completion',
            val: 'perComp'
        }, {
            key: 'New',
            val: 'cDt'
        }, {
            key: 'Recently Accessed',
            val: 'eDt'
        }];
        $scope.sortVal = 'eDt';

        vm.isFetchingCourses = true;
        vm.totalRendered = 0;
        vm.rows = vm.rows === '' ? 0 : parseInt(vm.rows);
        vm.filters = {
            basic: {
                brands: [],
                versions: [],
                industries: [],
                levels: [],
                languages: []
            },
            advanced: {
                design: [],
                role: []
            }
        };
        vm.selectedBrands = [];
        vm.selectedVersions = [];
        vm.selectedIndustries = [];
        vm.selectedLevels = [];
        vm.selectedLanguages = [];
        vm.courses = [];
        vm.courseRows = [];

        if ($stateParams.allTabFilters) {
            allTabFilters = $stateParams.allTabFilters;
        }

        vm.searchParameterFromHome = $stateParams.searchObject ?
            ($stateParams.searchObject.bNm ? $stateParams.searchObject.bNm : (
            $stateParams.searchObject.indT ? $stateParams.searchObject.indT :
             '')) : '';

        var sideMargin = $window.innerWidth * appConfig.layout.cardContainerSideMarginInPercentage / 100;
        vm.cols = parseInt(($window.innerWidth - sideMargin * 2) / appConfig.layout.cardWidth);
        if (vm.cols < 2) {
            vm.cols = 2;
        }

        vm.cardContainerWidth = appConfig.layout.cardWidth * vm.cols;
        appConfig.layout.containerWidthChanged = vm.cardContainerWidth;

        vm.rowsToRender = vm.rows;
        if (vm.rows === 0) {
            vm.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;  // 860 is
            // height of menu
            // bar + title + filters + footer. Add 2 extra rows than calculated
        }
        vm.courseRows = [];
        var numberOfCoursesToShowInOneBatch = vm.rowsToRender * vm.cols,
            numOfCoursesToFetch = vm.shallInfiniteScroll ? -1 : numberOfCoursesToShowInOneBatch;
        vm.isEndOfResult = false;

        courseFetch = function() {
            vm.courseFetchServiceCall({startIndex: 0, numOfCoursesToFetch: numOfCoursesToFetch})
                .then(function(courses) {
                    if (courses.libArr) {
                        vm.courseRows = [];
                        vm.courses = courses.libArr;
                        if (courses.tCnt === 0) {
                            vm.isNoResultFound = true;
                        }
                        vm.totalCount = courses.tCnt;
                        vm.totalRendered = numberOfCoursesToShowInOneBatch;
                        vm.courseRows = [];
                        vm.onCourseListUpdated();
                        if (vm.totalRendered >= vm.courses.length) {
                            vm.isEndOfResult = true;
                        }
                        vm.isFetchingCourses = false;
                    } else {
                        vm.isFetchingCourses = false;
                        vm.isNoResultFound = true;
                    }
                    if ($stateParams.searchFilters) {
                        // KKE6: TODO: !== 'object' should be replaced by === 'string'
                        // Test it properly before commit
                        if (typeof($stateParams.searchFilters) !== 'object') {
                            $stateParams.searchFilters = JSON.parse($stateParams.searchFilters);
                        }
                        for (var i = 0; i < $stateParams.searchFilters.length; i++) {
                            vm.selectedFilters.push($stateParams.searchFilters[i]);
                            if ($stateParams.searchFilters[i].category === 'vers') {
                                vm.selectedVersions.push($stateParams.searchFilters[i].details);
                            } else if ($stateParams.searchFilters[i].category === 'brands') {
                                vm.selectedBrands.push($stateParams.searchFilters[i].details);
                            } else if ($stateParams.searchFilters[i].category === 'inds') {
                                vm.selectedIndustries.push($stateParams.searchFilters[i].details);
                            } else if ($stateParams.searchFilters[i].category === 'lvl') {
                                vm.selectedLevels.push($stateParams.searchFilters[i].details);
                            } else if ($stateParams.searchFilters[i].category === 'langs') {
                                vm.selectedLanguages.push($stateParams.searchFilters[i].details);
                            }
                            vm.updateTickedValueForEachFilter();
                            vm.filterCourses();
                        }
                    }
                    vm.totalCountBeforeFilter = vm.totalCount;
                    $scope.$emit('updateLibraryCountBeforeFilter', vm.totalCount);
                });
        };

        courseFetch();

        $scope.$on('requestLicenseStatusUpdated', function() {
            courseFetch();
        });

        $scope.$on('updateLibrary', function() {
            vm.courseFetchServiceCall({startIndex: 0, numOfCoursesToFetch: numOfCoursesToFetch})
                .then(function(courses) {
                    vm.courses = courses.libArr;
                    vm.totalCount = courses.tCnt;
                    vm.totalRendered = numberOfCoursesToShowInOneBatch;
                    vm.courseRows = [];
                    vm.onCourseListUpdated();
                    if (vm.totalRendered >= vm.courses.length) {
                        vm.isEndOfResult = true;
                    }
                    vm.isFetchingCourses = false;
                });
        });

        if (vm.filterType === 'predefined') {
            courseService.getAllFilters()
                .then(function(filters) {
                    vm.filters = {
                        basic: {
                            brands: filters.basicFlt.bdArr,
                            versions: filters.basicFlt.verArr,
                            industries: filters.basicFlt.indArr,
                            levels: filters.basicFlt.lvlArr,
                            languages: filters.basicFlt.langArr
                        },
                        advanced: {
                            discipline: filters.advFlt.disArr,
                            jobRole: filters.advFlt.jrArr
                        }
                    };
                    if ($stateParams.searchObject) {
                        if ($stateParams.searchObject.bNm) {
                            vm.filters.basic.brands.forEach(function(ins) {
                                if (ins.nm === $stateParams.searchObject.bNm) {
                                    vm.selectedBrands.push({
                                        id: ins.id,
                                        isSelected: true,
                                        nm: $stateParams.searchObject.bNm
                                    });
                                }
                            });
                        } else if ($stateParams.searchObject.indId) {
                            vm.filters.basic.industries.forEach(function(ins) {
                                if (ins.id === $stateParams.searchObject.indId) {
                                    vm.selectedIndustries.push({
                                        id: ins.id,
                                        isSelected: true,
                                        nm: $stateParams.searchObject.indT
                                    });
                                }
                            });
                        }
                        vm.updateSelectedFilterList();
                        vm.updateTickedValueForEachFilter();
                        vm.filterCourses();
                    }
                });
        }

        vm.onCourseListUpdated = function() {
            vm.courseRows = [];
            for (var r = 0; r < vm.rowsToRender; r++) {
                vm.courseRows.push(vm.courses.slice(r * vm.cols, (r + 1) * vm.cols));
            }
            $scope.$emit('courseListUpdated', vm.courses);

            if (vm.filterType === 'dynamic') {    // build filter dynamically from course list
                var brandFilter = [],
                    versionFilter = [],
                    industryFilter = [],
                    levelFilter = [],
                    languageFilter = [],
                    disciplineFilter = [],
                    jobRollFilter = [];

                vm.courses.forEach(function(course) {
                    arrayHelpers.addUniqueElements(brandFilter, course.brands, 'id');
                    arrayHelpers.addUniqueElements(versionFilter, course.vers, 'id');
                    arrayHelpers.addUniqueElements(industryFilter, course.inds, 'id');
                    if (vm.isEmpty(course.lvl) === false) {
                        arrayHelpers.addUniqueElements(levelFilter, [course.lvl], 'id');
                    }
                    arrayHelpers.addUniqueElements(languageFilter, course.langs, 'id');
                    arrayHelpers.addUniqueElements(disciplineFilter, course.dics, 'id');
                });

                [brandFilter, versionFilter, industryFilter, levelFilter, languageFilter, disciplineFilter]
                    .forEach(function(filter) {
                        arrayHelpers.sort(filter, 'nm');
                    });

                vm.filters = {
                    basic: {
                        brands: brandFilter,
                        versions: versionFilter,
                        industries: industryFilter,
                        levels: levelFilter,
                        languages: languageFilter
                    },
                    advanced: {
                        discipline: disciplineFilter,
                        jobRole: jobRollFilter
                    }
                };

                if ($stateParams.searchObject) {
                    if ($stateParams.searchObject.bNm) {
                        vm.filters.basic.brands.forEach(function(ins) {
                            if (ins.nm === $stateParams.searchObject.bNm) {
                                vm.selectedBrands.push({
                                    id: ins.id,
                                    isSelected: true,
                                    nm: $stateParams.searchObject.bNm
                                });
                            }
                        });
                    } else if ($stateParams.searchObject.indId) {
                        vm.filters.basic.industries.forEach(function(ins) {
                            if (ins.id === $stateParams.searchObject.indId) {
                                vm.selectedIndustries.push({
                                    id: ins.id,
                                    isSelected: true,
                                    nm: $stateParams.searchObject.indT
                                });
                            }
                        });
                    }
                    vm.updateSelectedFilterList();
                    vm.updateTickedValueForEachFilter();
                    vm.filterCourses();
                }
            }
        };

        vm.getMoreCourses = function() {
            if (!vm.shallInfiniteScroll) {
                return;
            }

            if (vm.totalRendered < vm.courses.length) {
                vm.isFetchingCourses = true;
                vm.totalRendered += numberOfCoursesToShowInOneBatch;
                vm.rowsToRender = parseInt(vm.totalRendered / vm.cols);
                vm.filterCourses();
                if (vm.totalRendered >= vm.courses.length) {
                    vm.isEndOfResult = true;
                }
                vm.isFetchingCourses = false;
            } else {
                $log.info('Call Server for more courses');
                if (vm.infiniteScrollFetch !== '-1') {
                    vm.isFetchingCourses = true;
                    vm.courseFetchServiceCall({
                        startIndex: vm.courses.length,
                        numOfCoursesToFetch: vm.infiniteScrollFetch
                    })
                        .then(function(courses) {
                            vm.courses.push.apply(vm.courses, courses.libArr);
                            vm.totalCount += courses.tCnt;
                            vm.totalRendered += numberOfCoursesToShowInOneBatch;
                            vm.rowsToRender = parseInt(vm.totalRendered / vm.cols);
                            vm.onCourseListUpdated();
                            vm.isFetchingCourses = false;
                        });
                }
            }
        };

        vm.showBlueBackground = function() {
            return vm.showBlueBg === 'true';
        };

        vm.selectedFilters = [];
        vm.updateSelectedFilterList = function() {
            vm.selectedFilters = [];
            vm.selectedBrands.forEach(function(item) {
                vm.selectedFilters.push({category: 'brands', details: item});
            });
            vm.selectedVersions.forEach(function(item) {
                vm.selectedFilters.push({category: 'vers', details: item});
            });
            vm.selectedIndustries.forEach(function(item) {
                vm.selectedFilters.push({category: 'inds', details: item});
            });
            vm.selectedLevels.forEach(function(item) {
                vm.selectedFilters.push({category: 'lvl', details: item});
            });
            vm.selectedLanguages.forEach(function(item) {
                vm.selectedFilters.push({category: 'langs', details: item});
            });
        };

        vm.filterCourses = function() {
            filteredCards = [];
            vm.courses.forEach(function(course) {
                if (arrayHelpers.anyMatch(vm.selectedBrands, course.brands, 'id') &&
                    arrayHelpers.anyMatch(vm.selectedVersions, course.vers, 'id') &&
                    arrayHelpers.anyMatch(vm.selectedIndustries, course.inds, 'id') &&
                    arrayHelpers.anyMatch(vm.selectedLevels, [course.lvl], 'id') &&
                    arrayHelpers.anyMatch(vm.selectedLanguages, course.langs, 'id')) {
                    filteredCards.push(course);
                }
            });
            vm.courseRows = [];
            for (var r = 0; r < vm.rowsToRender; r++) {
                vm.courseRows.push(filteredCards.slice(r * vm.cols, (r + 1) * vm.cols));
            }

            vm.isEndOfResult = filteredCards.length <= vm.totalRendered;
            vm.totalCount = filteredCards.length;
            var isFilterApplied = vm.selectedFilters[0] ? true : false;
            $scope.$emit('updateLibraryCount', vm.totalCount, isFilterApplied);
        };

        vm.updateTickedValueForEachFilter = function() {
            vm.filters.basic.brands.forEach(function(brand) {
                brand.isSelected = false;
                if (vm.selectedBrands.length && arrayHelpers.anyMatch(vm.selectedBrands, [brand], 'nm')) {
                    brand.isSelected = true;
                }
            });
            vm.filters.basic.versions.forEach(function(version) {
                version.isSelected = false;
                if (vm.selectedVersions.length && arrayHelpers.anyMatch(vm.selectedVersions, [version], 'nm')) {
                    version.isSelected = true;
                }
            });
            vm.filters.basic.industries.forEach(function(industry) {
                industry.isSelected = false;
                if (vm.selectedIndustries.length && arrayHelpers.anyMatch(vm.selectedIndustries, [industry], 'nm')) {
                    industry.isSelected = true;
                }
            });
            vm.filters.basic.levels.forEach(function(level) {
                level.isSelected = false;
                if (vm.selectedLevels.length && arrayHelpers.anyMatch(vm.selectedLevels, [level], 'nm')) {
                    level.isSelected = true;
                }
            });
            vm.filters.basic.languages.forEach(function(language) {
                language.isSelected = false;
                if (vm.selectedLanguages.length && arrayHelpers.anyMatch(vm.selectedLanguages, [language], 'nm')) {
                    language.isSelected = true;
                }
            });
        };

        vm.filterChanged = function() {
            vm.updateSelectedFilterList();
            vm.updateTickedValueForEachFilter();

            if (vm.filterType === 'dynamic') {
                vm.filterCourses();
            }
        };

        vm.removeFilter = function(filter) {
            if (filter.category === 'brands') {
                arrayHelpers.remove(vm.selectedBrands, filter.details, 'nm');
            } else if (filter.category === 'vers') {
                arrayHelpers.remove(vm.selectedVersions, filter.details, 'nm');
            } else if (filter.category === 'inds') {
                arrayHelpers.remove(vm.selectedIndustries, filter.details, 'nm');
            } else if (filter.category === 'lvl') {
                arrayHelpers.remove(vm.selectedLevels, filter.details, 'nm');
            } else if (filter.category === 'langs') {
                arrayHelpers.remove(vm.selectedLanguages, filter.details, 'nm');
            }
            filter.details.isSelected = false;
            vm.filterChanged();
        };

        vm.updatedSelectedFiltersAndCourses = function() {
            vm.updateSelectedFilterList();

            if (vm.filterType === 'dynamic') {
                vm.filterCourses();
            }
        };

        vm.selectAllBrands = function() {
            vm.selectedBrands = vm.filters.basic.brands;
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectNoneBrands = function() {
            vm.selectedBrands = [];
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectAllVersions = function() {
            vm.selectedVersions = vm.filters.basic.versions;
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectNoneVersions = function() {
            vm.selectedVersions = [];
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectAllIndustries = function() {
            vm.selectedIndustries = vm.filters.basic.industries;
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectNoneIndustries = function() {
            vm.selectedIndustries = [];
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectAllLevels = function() {
            vm.selectedLevels = vm.filters.basic.levels;
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectNoneLevels = function() {
            vm.selectedLevels = [];
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectAllLanguages = function() {
            vm.selectedLanguages = vm.filters.basic.languages;
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.selectNoneLanguages = function() {
            vm.selectedLanguages = [];
            vm.updatedSelectedFiltersAndCourses();
        };

        vm.removeAllFilters = function() {
            vm.selectedBrands = [];
            vm.selectedVersions = [];
            vm.selectedIndustries = [];
            vm.selectedLevels = [];
            vm.selectedLanguages = [];
            vm.filterChanged();
        };

        vm.isEmpty = function isEmpty(myObject) {
            if (Object.keys(myObject).length === 0) {
                return true;
            }
            return false;
        };

        vm.addToFavorites = function(lobjId, favFlag) {
            vm.courses.forEach(function(course) {
                if (course.lObjId === lobjId) {
                    course.isFav = favFlag;
                }
            });
            courseService.addRemoveFav(lobjId, favFlag).then(function() {
                $rootScope.$broadcast('updateFavorites');
            });
        };

        vm.removeFavorites = function(lobjId, favFlag) {
            vm.courses.forEach(function(course) {
                if (course.lObjId === lobjId) {
                    course.isFav = favFlag;
                }
            });

            courseService.addRemoveFav(lobjId, favFlag).then(function() {
                $rootScope.$broadcast('updateFavorites');
            });
        };

        vm.sortOrderChange = function(sortParam) {
            if (filteredCards.length !== 0) {
                if (sortParam === 'cDt') {
                    filteredCards.forEach(function(obj, i) {
                        filteredCards[i].cDt = new Date(obj.cDt).toISOString();
                    });
                    arrayHelpers.sort(filteredCards, sortParam);
                    sortArr = filteredCards.reverse();
                } else if (sortParam === 'eDt') {
                    filteredCards.forEach(function(obj, i) {
                        filteredCards[i].eDt = new Date(obj.eDt).toISOString();
                    });
                    arrayHelpers.sort(filteredCards, sortParam);
                    sortArr = filteredCards.reverse();
                } else if (sortParam === 'perComp') {
                    sortArr = filteredCards.sort(arrayHelpers.sortByNumProperty(sortParam));
                } else if (sortParam === 'cT') {
                    arrayHelpers.sort(filteredCards, sortParam);
                    sortArr = filteredCards;
                }
                vm.courseRows = [];
                for (var r = 0; r < vm.rowsToRender; r++) {
                    vm.courseRows.push(sortArr.slice(r * vm.cols, (r + 1) * vm.cols));
                }
                vm.totalCount = filteredCards.length;
            } else {
                if (vm.rows === '0') {
                    vm.rowsToRender = parseInt(($window.innerHeight - 860) / appConfig.layout.cardHeight) + 2;
                    vm.rows = vm.rowsToRender;
                }
                if (sortParam === 'cDt') {
                    vm.courses.forEach(function(obj, i) {
                        vm.courses[i].cDt = new Date(obj.cDt).toISOString();
                    });
                    arrayHelpers.sort(vm.courses, sortParam);
                    sortArr = vm.courses.reverse();
                } else if (sortParam === 'eDt') {
                    vm.courses.forEach(function(obj, i) {
                        vm.courses[i].eDt = new Date(obj.eDt).toISOString();
                    });
                    arrayHelpers.sort(vm.courses, sortParam);
                    sortArr = vm.courses.reverse();
                } else if (sortParam === 'perComp') {
                    sortArr = vm.courses.sort(arrayHelpers.sortByNumProperty(sortParam));
                } else if (sortParam === 'cT') {
                    arrayHelpers.sort(vm.courses, sortParam);
                    sortArr = vm.courses;
                }
                vm.courseRows = [];
                for (var i = 0; i < vm.rowsToRender; i++) {
                    vm.courseRows.push(sortArr.slice(i * vm.cols, (i + 1) * vm.cols));
                }
                vm.totalCount = sortArr.length;
            }
        };

        vm.filterModalVisible = false;
        vm.toggleFilterModal = function() {
            vm.filterModalVisible = !vm.filterModalVisible;
        };

        vm.privateSearchTabSelection = function(tabName) {
            if (tabName === 'all') {
                $state.go('privateSearchAll', {searchText: vm.searchtext,
                                      isUserAuthenticated: true,
                                              allTabFilters: allTabFilters,
                                              searchFilters: vm.selectedFilters});
            }
        };
    }
})();
