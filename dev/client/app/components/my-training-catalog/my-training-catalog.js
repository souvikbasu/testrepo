(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:myTrainingCatalog
     * @restrict E
     *
     * @description
     * Component to show my training catalog
     *
     * @param {int} summary 1 if it should be shown in as summary view in dashboard page, else 0 or skip the attribute
     * @param {int} rows Number of rows of assignments to show
     * @param {string} title Title of My Assignment component
     * @param {string} desc Description of My Assignment component to be shown under title
     *
     * @example
     <my-training-catalog ng-if="zone.name == 'training-catalogs'" summary="1"
     rows="{{ zone.rows }}" title="{{ zone.title | html }}" desc="{{ zone.desc | html }}"></my-training-catalog>
     */
    angular
        .module('cls')
        .controller('MyTrainingCatalogCtrl', ['$rootScope', '$scope', '$window', '$state',
                                              '$stateParams', 'appConfig', 'arrayHelpers',
            'programService', 'appSettingsService', MyTrainingCatalogCtrl])
        .component('myTrainingCatalog', {
            bindings: {
                summary: '@',
                rows: '@',
                title: '@',
                desc: '@'
            },
            controller: 'MyTrainingCatalogCtrl',
            templateUrl: 'app/components/my-training-catalog/my-training-catalog.tmpl.html'
        });

    function MyTrainingCatalogCtrl($rootScope, $scope,
                                   $window,
                                   $state,
                                   $stateParams,
                                   appConfig,
                                   arrayHelpers,
                                   programService,
                                   appSettingsService) {
        var vm = this;
        vm.sortValues = [{
            key: 'Alphabetical',
            val: 'pNm'
        }, {
            key: 'Start Date',
            val: 'sDt'
        }, {
            key: 'Valid Until',
            val: 'eVdt'
        }];
        $scope.sortVal = 'eVdt';

        vm.infiniteScrollFetchCatalog = vm.summary === '1' ? '0' : '*';
        vm.infiniteScrollShowCatalog = appConfig.userHomePage.infiniteScrollItemsToRender;
        vm.isFetchingCatalog = false;
        vm.totalRenderedCatalog = 0;
        vm.detailDescriptionStorage = {};
        vm.infiniteScrollFetch = -1;

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
                    if (layout.id === 3) {  // assignments
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

        vm.latestTrainingCatalogRows = [];
        var numberOfCatalogsToShowInOneBatch = vm.rowsToRender * vm.cols,
            numOfCatalogsToFetch = vm.shallInfiniteScroll ? -1 : numberOfCatalogsToShowInOneBatch;
        vm.isEndOfResult = false;
        programService.getLatestMyTrainingCatalog(0, numOfCatalogsToFetch)
            .then(function(catalog) {
                if (catalog.tCatArr) {
                    vm.latestTrainingCatalog = catalog.tCatArr;
                    // arrayHelpers.sort(vm.latestTrainingCatalog, $scope.sortVal);  // default sort

                    if (catalog.tCnt === 0) {
                        vm.isNoResultFound = true;
                    }
                    vm.totalCount = catalog.tCnt;
                    if (vm.totalCount + vm.cols <= numberOfCatalogsToShowInOneBatch) {
                        vm.rowsToRender -= 1;
                        numberOfCatalogsToShowInOneBatch = vm.totalCount;
                    }
                    if (vm.totalCount <= numberOfCatalogsToShowInOneBatch) {
                        vm.totalRenderedCatalog = vm.totalCount;
                    } else {
                        vm.totalRenderedCatalog = numberOfCatalogsToShowInOneBatch;
                    }

                    // vm.totalRenderedCatalog = numberOfCatalogsToShowInOneBatch;
                    vm.latestTrainingCatalogRows = [];
                    for (var r = 0; r < vm.rowsToRender; r++) {
                        vm.latestTrainingCatalogRows.push(
                            vm.latestTrainingCatalog.slice(r * vm.cols, (r + 1) * vm.cols));
                    }
                    if (vm.latestTrainingCatalog.length <= vm.totalRenderedCatalog) {
                        vm.isEndOfResult = true;
                    }
                    vm.isFetchingCatalog = false;
                } else {
                    vm.totalCount = 0;
                    vm.isNoResultFound = true;
                    vm.isFetchingCatalog = false;
                }
            });

        $rootScope.$on('resetDetailsIndex', function(event, parent) {
            if (parent === 'catalogs') {
                $scope.$broadcast('disableDetails');
            }
        });

        vm.seeAll = function() {
            $state.go('user.training-catalogs', {
                title: vm.title,
                desc: vm.desc
            });
        };

        // TODO: This function has to be removed as requirement is changed.
        vm.removeCard = function(id) {
            vm.removedCard = parseInt(id);
            vm.latestTrainingCatalogRows.forEach(function(insArray) {
                insArray.forEach(function(ins, index) {
                    if (ins.pId === vm.removedCard) {
                        insArray.splice(index, 1);
                    }
                });
            });
        };

        vm.getMoreTrainingCatalog = function() {
            if (!vm.shallInfiniteScroll) {
                return;
            }

            if (vm.totalRenderedCatalog < vm.latestTrainingCatalog.length) {
                vm.isFetchingCatalog = true;
                vm.totalRenderedCatalog += numberOfCatalogsToShowInOneBatch;
                var existingRowsCount = vm.rowsToRender;
                vm.rowsToRender = parseInt(vm.totalRenderedCatalog / vm.cols);
                for (var r = existingRowsCount; r < vm.rowsToRender; r++) {
                    vm.latestTrainingCatalogRows.push(
                        vm.latestTrainingCatalog.slice(r * vm.cols, (r + 1) * vm.cols));
                }
                if (vm.totalRenderedCatalog >= vm.latestTrainingCatalog.length) {
                    vm.totalRenderedCatalog = vm.latestTrainingCatalog.length;
                    vm.isEndOfResult = true;
                }
                vm.isFetchingCatalog = false;
            } else {
                if (vm.infiniteScrollFetch !== -1) {
                    vm.isFetchingCatalog = true;
                    programService.getNextTrainingCatalog(vm.latestTrainingCatalog.length,
                        vm.infiniteScrollFetchCatalog)
                        .then(function(catalog) {
                            vm.latestTrainingCatalog.push.apply(vm.latestTrainingCatalog,
                                catalog.tCatArr);
                            vm.totalCount += catalog.tCnt;
                            vm.totalRenderedCatalog += numberOfCatalogsToShowInOneBatch;
                            vm.isFetchingCatalog = false;
                            vm.latestTrainingCatalogRows = [];
                            // TODO: Take upper limit for rows in infinite scroll rather than parseInt.
                            vm.rowsToRender = parseInt(vm.totalRenderedCatalog / vm.cols);
                            for (var r = 0; r < vm.rowsToRender; r++) {
                                vm.latestTrainingCatalogRows.push(
                                    vm.latestTrainingCatalog.slice(r * vm.cols, (r + 1) * vm.cols));
                            }
                        });
                }
            }
        };

        vm.sortOrderChange = function(sortParam) {
            if (sortParam === 'sDt' || sortParam === 'eVdt') {
                vm.latestTrainingCatalog.forEach(function(obj, i) {
                    if (sortParam === 'sDt') {
                        vm.latestTrainingCatalog[i].sDt  = new Date(obj.sDt).toISOString();
                    } else if (sortParam === 'eVdt') {
                        vm.latestTrainingCatalog[i].eVdt  = new Date(obj.eVdt).toISOString();
                    }
                });
                arrayHelpers.sort(vm.latestTrainingCatalog, sortParam);
            } else {
                arrayHelpers.sort(vm.latestTrainingCatalog, sortParam);
            }
            vm.latestTrainingCatalogRows = [];
            for (var r = 0; r < vm.rows; r++) {
                vm.latestTrainingCatalogRows.push(vm.latestTrainingCatalog.slice(r * vm.cols, (r + 1) * vm.cols));
            }
            vm.totalCount = vm.latestTrainingCatalog.length;
        };
    }
})();
