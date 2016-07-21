(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:publicSearchCard
     * @restrict E
     * @description
     * Component to show a course card
     *
     * @param {int} courseid Id of course
     * @param {string} title Title of course
     * @param {string} thumbnail Url of thumbnail image
     * @param {number} percentage Percentage of completion
     * @param {string} lan language of course
     * @param {string} version Version of course
     * @param {string} duration Duration of course
     * @param {int} status Status of course
     * @param {boolean} fav course is marked as favorite
     * @param {int} index index of the course
     * @param {boolean} lnchble if course is launchable or not
     * @param {ng Expression} addRemFav function as a callback to component event
     * @example <course-card courseid="{{ course.lObjId }}" title="{{ course.cT
     * }}" thumbnail="{{ course.thumb }}" percentage="{{ course.perComp
     * }}" lan="{{ course.lan }}" version="{{ course.version }}" duration="{{ course.etimLeft
     * }}" index="{{ $index }}" fav="{{ course.isFav }}" lnchble="{{course.lnchble
     * }}" add-rem-fav="$ctrl.addRemoveFavorites($index, course.lObjId, !course.isFav)"><course-card>
     */
    angular.module('cls').controller('PublicSearchCardCtrl', ['$state', PublicSearchCardCtrl]).component(
            'publicSearchCard', {
                bindings: {
                    courseid: '@',
                    title: '@',
                    thumbnail: '@',
                    langs: '=',
                    versions: '=',
                    duration: '@',
                    index: '@',
                    filters: '@'
                },
                controller: 'PublicSearchCardCtrl',
                templateUrl: 'app/components/public-search-card/public-search-card.tmpl.html'
            });

    function PublicSearchCardCtrl($state) {
        var vm = this;
        vm.width = 1080;
        vm.height = 960;
        vm.tops = 0;
        vm.openVerDropdown = false;
        vm.openLangDropdown = false;
        // dcn6: ToDo
        vm.lan = 'en';
        vm.thumbnailSrc = vm.thumbnail || 'static/images/course-card-placeholder.jpg';

        vm.myVars = JSON.stringify(vm.versions);
        vm.courseDetails = function() {
            var courseObject = {lang: vm.lan, lId: vm.courseid,
                                 lmsg: '', filters: vm.filters,
                                launchable: false, btnFav: false,
                                prevState: $state.$current.name,
                               isPublicSearch: true};
            $state.go('course', {courseDetails: courseObject});
        };

        vm.selectedVersion = vm.versions[0];
        vm.versionDropdownOpen = function() {
            vm.openVerDropdown = !vm.openVerDropdown;
            if (vm.openLangDropdown) {
                vm.openLangDropdown = false;
            }
        };
        vm.selectedLang = vm.langs[0];
        vm.languageDropdownOpen = function() {
            vm.openLangDropdown = !vm.openLangDropdown;
            if (vm.openVerDropdown) {
                vm.openVerDropdown = false;
            }
        };
    }
})();

