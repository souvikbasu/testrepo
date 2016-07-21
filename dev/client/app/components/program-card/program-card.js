(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:programCard
     * @restrict E
     *
     * @description
     * Component to show a program card
     *
     * @param {string} title Title of program
     * @param {int} total Total number of courses in the program
     * @param {int} completed Completed courses
     * @param {int} id Program Id of course
     * @param {boolean} status Program status which is either Pending or Enroll
     * @param {boolean} moderate Program is either moderate or not
     * @param {string} parent Parent component of the Program Card
     * @param {date} startd Start date of program
     * @param {date} endd End date of program
     *
     * @example
     <program-card title="{{ assignment.pNm }}" total="{{ assignment.tCnt }}"
     completed="{{ assignment.cCnt }}" index="{{ $index }}" parent="assignment"
     status="{{ catalog.enSts }}" moderate="{{ catalog.mod }}" startd="{{ assignment.sDt }}"
     endd="{{ assignment.eDt }}">
     */
    angular
        .module('cls')
        .controller('ProgramCardCtrl', ['$window', '$rootScope', '$scope', '$timeout',
            '$state', '$filter', 'appConfig', 'appConstants', 'programService',
            'courseService', ProgramCardCtrl])
        .component('programCard', {
            bindings: {
                title: '@',
                total: '@',
                completed: '@',
                id: '@',
                status: '@',
                moderate: '@',
                parent: '@',
                startd: '@',
                endd: '@',
                cmplsts: '@'
            },
            controller: 'ProgramCardCtrl',
            templateUrl: 'app/components/program-card/program-card.tmpl.html'
        });

    function ProgramCardCtrl($window, $rootScope, $scope, $timeout,
            $state, $filter, appConfig, appConstants, programService, courseService) {
        var vm = this,
            courseObject;

        vm.details = false;
        vm.percentageComplete = 0;
        vm.width = 1080;
        vm.height = 960;
        vm.tops = 0;
        vm.status = parseInt(vm.status);

        $timeout(function() {
            if (vm.completed) {
                vm.percentageComplete = (vm.completed / vm.total) * 100;
            }
        }, 0.5);

        if (vm.status) {
            for(var key in appConstants.trainingCatalog) {
                if (appConstants.trainingCatalog.hasOwnProperty(key)) {
                    if (appConstants.trainingCatalog[key] === vm.status) {
                        vm.clsStatus = key;
                    }
                }
            }
        }

        var cardContainerWidth = appConfig.layout.containerWidthChanged;
        vm.detailsWidth = cardContainerWidth - 17;
        vm.leftMargin = ($window.innerWidth - cardContainerWidth) / 2;

        var date = new Date();
        // This has to be handled for Firefox and IE compatibility
        vm.startd = $filter('formatdate')(vm.startd);
        vm.endd = $filter('formatdate')(vm.endd);
        vm.startd = Date.parse(vm.startd.split(' ').join('T'));
        vm.endd = Date.parse(vm.endd.split(' ').join('T'));
        if (vm.startd > date) {
            vm.isStarted = false;
            vm.isEnded = false;
        } else {
            vm.isStarted = true;
            if (vm.endd > date) {
                vm.isEnded = false;
            } else {
                vm.isEnded = true;
            }
        }

        vm.enableDetails = function() {
            if (vm.details === true) {
                vm.details = !vm.details;
                vm.summaryHeight = '260px';
            } else {
                if (vm.parent === 'assignments') {
                    programService.getAssignmentsDetails(vm.id)
                    .then(function(details) {
                            vm.trainingCatalogDetails = details;
                            vm.programCardDetailsHeight = {height: vm.trainingCatalogDetails.length * 110 + 'px'};
                            vm.summaryHeight = (vm.trainingCatalogDetails.length * 110) + 260 + 'px';
                        });
                } else if (vm.parent === 'catalogs') {
                    programService.getTrainingCatalogCourseDetails(vm.id)
                    .then(function(details) {
                            vm.trainingCatalogDetails = details;
                            vm.programCardDetailsHeight = {height: vm.trainingCatalogDetails.length * 110 + 'px'};
                            vm.summaryHeight = (vm.trainingCatalogDetails.length * 110) + 260 + 'px';
                        });
                }
                $rootScope.$emit('resetDetailsIndex', vm.parent);
                vm.details = !vm.details;
            }
        };

        vm.fetchPDF = function(lObjId) {
            programService.getPdfDetails(lObjId, vm.id)
                .then(function(details) {
                    vm.pdfDetails = details;
                });
        };

        vm.enroll = function() {
            if (vm.details === true) {
                vm.details = !vm.details;
                vm.summaryHeight = '260px';
            }
            vm.flipFront = {transform: 'rotateY(180deg)'};
            vm.flipBack = {transform: 'rotateY(0deg)'};
        };

        vm.confirmNonModerateEnroll = function() {
            // TODO: This has to removed as requirement is changed.
            $scope.$parent.$parent.$ctrl.removeCard(vm.id);
        };

        // Styling need to be added in JS because multiple scenarios can not be written in scss.
        vm.confirmModerateEnroll = function() {
            vm.flipFront = {transform: 'rotateY(0deg)'};
            vm.flipBack = {transform: 'rotateY(-180deg)'};
            vm.clsStatus = '_REQUEST_PENDING';
        };

        vm.cancelEnroll = function() {
            vm.flipFront = {transform: 'rotateY(0deg)'};
            vm.flipBack = {transform: 'rotateY(-180deg)'};
        };

        vm.play = function(lobjId, lang) {
            vm.trainingCatalogDetails.forEach(function(obj, i) {
                if (vm.trainingCatalogDetails[i].lObjId === lobjId) {
                    vm.courseDetails(vm.trainingCatalogDetails[i]);
                }
            });
            courseService.showPlayerWindow(lobjId, 0, lang, vm.id).then(
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

        $scope.$on('disableDetails', function() {
            vm.details = false;
            vm.summaryHeight = '260px';
            vm.programCardDetailsHeight = {height: '0px'};
        });

        vm.courseDetails = function(lesson) {
            if (!lesson.lan) {
                lesson.lan = appConfig.userHomePage.userProfileLanguage;
            }
            if (vm.parent === 'assignments') {
                courseObject = {lang: lesson.lan, lId: lesson.lObjId,
                                 lmsg: lesson.lnchmsg, launchable: lesson.launchable,
                                btnFav: false, prevState: $state.$current.name,
                               pId: vm.id};
            } else if (vm.parent === 'catalogs') {
                courseObject = {lang: lesson.lan, lId: lesson.lObjId,
                                 lmsg: lesson.lnchmsg, launchable: lesson.launchable,
                                btnFav: false, prevState: $state.$current.name};
            }
            $state.go('course', {courseDetails: courseObject});
        };
    }
})();
