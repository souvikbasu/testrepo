(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:CourseMetaDataCtrl
     * @description Controller for course meta data page. Shows all information
     *              for a course and allows to launch a course
     */
    angular.module('cls').controller('CourseMetaDataCtrl',
            ['$state', '$rootScope', '$scope', '$timeout', '$stateParams',
             '$window', 'courseService', CourseMetaDataCtrl]);

    function CourseMetaDataCtrl($state, $rootScope, $scope, $timeout, $stateParams,
                                 $window, courseService) {
        var pId;
        $scope.courseDetails = $stateParams.courseDetails;
        $scope.width = 1080;
        $scope.height = 960;
        $scope.tops = 0;
        $scope.openDropdown = false;

        $scope.iconFav = 'static/images/icon-faved.png';
        $scope.iconAddFav = 'static/images/icon-fav.png';

        if ($scope.courseDetails.prevState) {
            $rootScope.enablePreviousState = $scope.courseDetails.prevState;
        }

        if ($scope.courseDetails && $scope.courseDetails.pId) {
            pId = $scope.courseDetails.pId;
        }

        var getCourseDetails = function() {
            courseService.getCourseMetaData($scope.courseDetails).then(function(course) {
                $scope.course = course;
                $scope.course.obj = $scope.course.obj.split('\n');
                $scope.selectedLanguage = $scope.course.langs[0];

                // thumbnail modification
                var thumbnail = $scope.course.cThumb,
                fExt = thumbnail.slice((Math.max(0, thumbnail.lastIndexOf('.')) || Infinity) + 1),
                fName = thumbnail.substring(thumbnail.lastIndexOf('/') + 1, thumbnail.lastIndexOf('.')),
                fPath = thumbnail.substring(0, thumbnail.indexOf(fName.concat('.' + fExt)));
                if (fName === 'companion') {
                    $scope.course.cThumb = fPath + 'companion_large' + '.' + fExt;
                } else {
                    $scope.course.cThumb = 'static/images/default-image-metadata.png';
                }

                $scope.course.langs.forEach(function(ins, index) {
                    if (ins.id === $scope.course.lang) {
                        $scope.selectedLanguage = $scope.course.langs[index];
                    }
                });
                $timeout(function() {
                    for (var i = 0; i < $scope.course.lcoArr.length; i++) {
                        $scope.course.lcoArr[i].compNum = parseInt($scope.course.lcoArr[i].perComp);
                    }
                }, 0.5);
                $timeout(function() {
                    $scope.course.crsCompInt = parseInt($scope.course.perComp);
                }, 0.5);
            });
        };

        getCourseDetails();

        $scope.languageChange = function(lang) {
            $scope.courseDetails.lang = lang.id;
            $scope.openDropdown = !$scope.openDropdown;
            getCourseDetails();
        };

        $scope.back = function() {
            if ($scope.courseDetails.isPublicSearch === true ||
                $scope.courseDetails.isPublicSearch === 'true') {
                $scope.isUserAuthenticated = false;
            } else {
                $scope.isUserAuthenticated = true;
            }
            $state.go($scope.courseDetails.prevState, {searchFilters: $scope.courseDetails.filters,
                                                      isUserAuthenticated: $scope.isUserAuthenticated});
        };

        $scope.languageDropdownOpen = function() {
            $scope.openDropdown = !$scope.openDropdown;
        };

        $scope.play = function(lobjId, lcoId, lang) {
            courseService.showPlayerWindow(lobjId, lcoId, lang, pId).then(
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

        $scope.addToFav = function(lobjId, favFlag) {
            if ($scope.course.id === lobjId) {
                $scope.course.btnFav = favFlag;
            }
            courseService.addRemoveFav(lobjId, favFlag).then(function() {
                $rootScope.$broadcast('updateFavorites');
            });
        };
        $scope.remFromFav = function(lobjId, favFlag) {
            if ($scope.course.id === lobjId) {
                $scope.course.btnFav = favFlag;
            }
            courseService.addRemoveFav(lobjId, favFlag).then(function() {
                $rootScope.$broadcast('updateFavorites');
            });
        };
    }
})();

