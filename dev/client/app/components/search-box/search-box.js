(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:searchBox
     * @restrict E
     *
     * @description
     * Component to show search box
     *
     * @param {string} placeholder Placeholder text to show in empty search box
     * @param {string} searchtext Text to prepopulate search box input
     *
     * @example
        <search-box searchtext="{{ searchText }}" placeholder="Search in Boeing Catalog"></search-box>
     */
    angular
        .module('cls')
        .controller('SearchBoxCtrl', ['$state', '$rootScope', 'courseService', SearchBoxCtrl])
        .component('searchBox', {
            bindings: {
                placeholder: '@',
                searchtext: '@',
                theme: '@',
                isUserAuthenticated: '@'
            },
            controller: 'SearchBoxCtrl',
            templateUrl: 'app/components/search-box/search-box.tmpl.html'
        });

    function SearchBoxCtrl($state, $rootScope, courseService) {
        var vm = this;
        vm.isVisible = false;
        vm.searchResult = [];

        vm.onSearchTextChange = function() {
            if (vm.searchtext.trim().length) {
                vm.isUserAuthenticated = vm.isUserAuthenticated ?
                    vm.isUserAuthenticated.toString() : '';
                if (vm.isUserAuthenticated === 'true') {
                    vm.searchResult = [];
                    for (var i = 0; i <= $rootScope.privateSearchTypeAheadResponse.length; i++) {
                        if ($rootScope.privateSearchTypeAheadResponse &&
                            $rootScope.privateSearchTypeAheadResponse[i] &&
                            $rootScope.privateSearchTypeAheadResponse[i].lObjTit &&
                            $rootScope.privateSearchTypeAheadResponse[i].lObjTit.
                            toLowerCase().indexOf(vm.searchtext.toLowerCase()) !== -1) {
                            vm.searchResult.push($rootScope.privateSearchTypeAheadResponse[i]);
                        }
                    }
                    vm.isVisible = true;
                } else {
                    courseService.searchFromCourseList(vm.searchtext)
                        .then(function(result) {
                            vm.searchResult = result;
                            vm.isVisible = true;
                        });
                }
            } else {
                vm.searchResult = [];
            }
        };

        vm.search = function() {
            $rootScope.searchText = vm.searchtext;
            if (vm.isUserAuthenticated === true ||
               vm.isUserAuthenticated === 'true') {
                $state.go('privateSearchAll', {searchText: vm.searchtext,
                                      isUserAuthenticated: vm.isUserAuthenticated});
            } else {
                $state.go('publicSearch', {searchText: vm.searchtext,
                                          isUserAuthenticated: vm.isUserAuthenticated});
            }
        };

        vm.courseDetails = function(course) {
            var btnFav = course.btnFav ? course.btnFav : false,
                lang = course.lang ? course.lang : 'en',
                launchable = course.launchable ? course.launchable : false,
                lmsg = course.lmsg ? course.lmsg : 'TODO: No launch message for me.',
                courseObject = {lang: lang, lId: course.lObjId,
                                 lmsg: lmsg, launchable: launchable,
                                btnFav: btnFav, prevState: $state.$current.name};
            $state.go('course', {courseDetails: courseObject});
        };

        vm.toggleDropDown = function toggleDropDown(isVisible) {
            vm.isVisible = isVisible;
        };

        vm.isDarkTheme = function() {
            return vm.theme === 'dark';
        };

        // emit-broadcast can not be used because on method is getting generated after sometime,
        // so variable is not getting catched in 'on'. $rootScope and value is the only option.
        if ($rootScope.searchText) {
            vm.searchtext = $rootScope.searchText;
        }
    }
})();
