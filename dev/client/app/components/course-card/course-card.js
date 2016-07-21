(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:courseCard
     * @restrict E
     * @description Component to show a course card
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
     * @param {boolean} isLaunchable if course is launchable or not
     * @param {string} lmsg launch message for the course
     * @param {ng Expression} removeFav function as a callback to component
     *        event to unmark course
     * @param {ng Expression} addFav function as a callback to component event
     *        to add course as favorite
     * @example <course-card courseid="{{ course.lObjId }}" title="{{ course.cT
     *          }}" thumbnail="{{ course.thumb }}" percentage="{{ course.perComp
     *          }}" lan="{{ course.lan }}" version="{{ course.version }}"
     *          duration="{{ course.etimLeft }}" index="{{ $index }}" fav="{{
     *          course.isFav }}" isLaunchable="{{course.lnchble }}"
     *          add-rem-fav="$ctrl.addRemoveFavorites($index, course.lObjId,
     *          !course.isFav)"><course-card>
     */
    angular.module('cls').controller('CourseCardCtrl', ['$rootScope', '$scope', '$state', '$window',
            'courseService', CourseCardCtrl]).component(
            'courseCard', {
                bindings: {
                    courseid: '@',
                    viewid: '@',
                    title: '@',
                    thumbnail: '@',
                    percentage: '@',
                    lan: '@',
                    version: '@',
                    duration: '@',
                    status: '@',
                    fav: '@',
                    isLaunchable: '@',
                    lmsg: '@',
                    removeFav: '&',
                    addFav: '&',
                    filters: '@',
                    cmplsts: '@'
                },
                controller: 'CourseCardCtrl',
                templateUrl: 'app/components/course-card/course-card.tmpl.html'
            });

    function CourseCardCtrl($rootScope, $scope, $state, $window, courseService) {
        var vm = this, fExt, fName, fPath;
        vm.width = 1080;
        vm.height = 960;
        vm.tops = 0;
        // vm.thumbnailSrc = vm.thumbnail || 'static/images/course-card-placeholder.jpg';
        // thumbnail modification
        fExt = vm.thumbnail.slice((Math.max(0, vm.thumbnail.lastIndexOf('.')) || Infinity) + 1);
        fName = vm.thumbnail.substring(vm.thumbnail.lastIndexOf('/') + 1, vm.thumbnail.lastIndexOf('.'));
        fPath = vm.thumbnail.substring(0, vm.thumbnail.indexOf(fName.concat('.' + fExt)));
        if (fName === 'companion') {
            vm.thumbnailSrc = fPath + 'companion_medium' + '.' + fExt;
        } else {
            vm.thumbnailSrc = 'static/images/course-card-placeholder.jpg';
        }

        vm.status = parseInt(vm.status);
        vm.iconFav = 'static/images/icon-faved.png';
        vm.iconAddFav = 'static/images/icon-fav.png';

        if (vm.status) {
            for(var key in appConstants.library) {
                if (appConstants.library.hasOwnProperty(key)) {
                    if (appConstants.library[key] === vm.status) {
                        vm.clsStatus = key;
                    }
                }
            }
        }

        vm.courseDetails = function() {
            var launchable, courseObject;
            launchable = (vm.isLaunchable === 'true' || vm.clsStatus === '_LAUNCHABLE') ? true : false;
            courseObject = {lang: vm.lan, lId: vm.courseid,
                                lmsg: vm.lmsg, filters: vm.filters,
                                launchable: launchable, btnFav: vm.fav,
                                prevState: $state.$current.name};
            $state.go('course', {courseDetails: courseObject});
        };

        vm.enroll = function() {
            // vm.flipFront = {transform: 'rotateY(180deg)'};
            // vm.flipBack = {transform: 'rotateY(0deg)'};
            vm.confirmBoxOutput = confirm('Are you sure You want to enroll?');
            if (vm.confirmBoxOutput === true) {
                vm.confirmEnroll();
            } else {
                vm.cancelEnroll();
            }
        };

        vm.confirmEnroll = function() {
            courseService.requestLicenseInLibrary(vm.viewid, vm.courseid)
            .then(function(reqL) {
                if (reqL) {
                    for(var key in appConstants.library) {
                        if (appConstants.library.hasOwnProperty(key)) {
                            if (appConstants.library[key] === reqL.rSts) {
                                vm.clsStatus = key;
                                $scope.$emit('requestLicenseStatusUpdated');
                            }
                        }
                    }
                }
            });
            // vm.flipFront = {transform: 'rotateY(0deg)'};
            // vm.flipBack = {transform: 'rotateY(-180deg)'};
        };

        vm.cancelEnroll = function() {
            // vm.flipFront = {transform: 'rotateY(0deg)'};
            // vm.flipBack = {transform: 'rotateY(-180deg)'};
        };

        vm.play = function(lobjId, lang, lcoId) {
            vm.courseDetails();
            if (lcoId === undefined) {
                lcoId = 0;
            }
            courseService.showPlayerWindow(lobjId, lcoId, lang).then(
                    function(URL) {
                        var WIDTH , HEIGHT, x, y, options;
                        WIDTH = 1050;
                        HEIGHT = 882;

                        x = Math.round((screen.width - WIDTH) / 2);
                        y = Math.round((screen.height - HEIGHT) / 2);
                        options = 'toolbar=0,menubar=0,status=1,screenX=' + x +
                        ',screenY=' + y + ',width=' + WIDTH + ',height=' + HEIGHT + ',resizable=1, top=10';

                        var playerWin = $window.open(URL, '', options);
                        if ($window.focus) {
                            playerWin.focus();
                        }
                    });
        };

        vm.hoverIn = function() {
            if (vm.fav === 'true') {
                vm.iconFavFlag = true;
                vm.iconAddFavFlag = false;
            } else {
                vm.iconFavFlag = false;
                vm.iconAddFavFlag = true;
            }
        };

        vm.hoverOut = function() {
            if (vm.iconFavFlag === true) {
                vm.iconFavFlag = false;
            } else if (vm.iconAddFavFlag === true) {
                vm.iconAddFavFlag = false;
            }
        };
        vm.addToFav = function(lobjId, favFlag) {
            if (vm.iconAddFavFlag === true) {
                vm.iconAddFavFlag = false;
                vm.iconFavFlag = true;
            }
            vm.fav = favFlag;
            vm.addFav({lid: lobjId, isFav: favFlag});
        };
        vm.removeFromFav = function(lobjId, favFlag) {
            if (vm.iconFavFlag === true) {
                vm.iconFavFlag = false;
                vm.iconAddFavFlag = true;
            }
            vm.fav = favFlag;
            vm.removeFav({lid: lobjId, isFav: favFlag});
        };
    }
})();
