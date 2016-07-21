(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name cls.directive:privateSearchCard
     * @restrict E
     *
     * @description
     * Component to show a private search card
     *
     * @param {string} lessons Title of program
     * @param {int} title Total number of courses in the program
     * @param {int} id Completed courses
     * @param {int} launchable Program Id of course
     * @param {boolean} launchMessage Program status which is either Pending or Enroll
     * @param {boolean} bookmarked Program is either moderate or not
     * @param {boolean} lcoid Program is either moderate or not
     *
     * @example
     <private-search-card title="{{ assignment.pNm }}" total="{{ assignment.tCnt }}"
     completed="{{ assignment.cCnt }}" index="{{ $index }}" parent="assignment"
     status="{{ catalog.enSts }}" moderate="{{ catalog.mod }}" startd="{{ assignment.sDt }}"
     endd="{{ assignment.eDt }}">
     */
    angular
        .module('cls')
        .controller('PrivateSearchCardCtrl', ['$window', '$rootScope', '$scope',
            '$state', 'appConfig', 'courseService',
            PrivateSearchCardCtrl])
        .component('privateSearchCard', {
            bindings: {
                lessons: '=',
                title: '@',
                id: '@',
                launchable: '@',
                launchMessage: '@',
                bookmarked: '@',
                lcoid: '@',
                defImage: '@',
                version: '@'
            },
            controller: 'PrivateSearchCardCtrl',
            templateUrl: 'app/components/private-search-card/private-search-card.tmpl.html'
        });

    function PrivateSearchCardCtrl($window, $rootScope, $scope,
            $state, appConfig, courseService) {
        var vm = this;

        vm.details = false;
        vm.width = 1080;
        vm.height = 960;
        vm.tops = 0;
        vm.itemHovered = false;

        var cardContainerWidth = appConfig.layout.containerWidthChanged;
        vm.detailsWidth = cardContainerWidth - 17;
        vm.leftMargin = ($window.innerWidth - cardContainerWidth) / 2;
        vm.thumbnailSrc = 'static/images/course-card-placeholder.jpg';
        vm.iconFav = 'static/images/icon-faved.png';
        vm.iconAddFav = 'static/images/icon-fav.png';

        vm.enableMoreResults = function() {
            if (vm.details === true) {
                vm.details = !vm.details;
                vm.summaryHeight = '390px';
            } else {
                $rootScope.$emit('resetSeeMoreResultsIndex');
                if (vm.lessons.length < 5) {
                    vm.programCardDetailsHeight = 170;
                } else if (vm.lessons.length <= 7) {
                    vm.programCardDetailsHeight = 340;
                } else {
                    vm.programCardDetailsHeight = 510;
                }
                vm.summaryHeight = vm.programCardDetailsHeight + 390 + 'px';
                vm.details = !vm.details;
            }
        };

        vm.screenPlay = function(screen) {
            courseService.exaleadScreenLaunch(vm.id,
                                              vm.lcoid,
                                              screen.skUid,
                                              screen.scrUid,
                                              screen.cw,
                                              screen.lang
                                             ).then(function(URL) {
                vm.left = (screen.width / 2) - (vm.width / 2);
                var playerWin = $window.open(URL, '',
                    'width=' + vm.width + ', height=' + vm.height +
                    ', top=' + vm.tops + ', left=' + vm.left);
                if ($window.focus) {
                    playerWin.focus();
                }
            });
        };

        $scope.$on('disableSeeMoreResults', function() {
            vm.details = false;
            vm.summaryHeight = '390px';
            vm.programCardDetailsHeight = {height: '0px'};
        });

        vm.courseDetails = function() {
            var lan = appConfig.userHomePage.userProfileLanguage,
                courseObject = {lang: lan, lId: vm.id,
                                 lmsg: vm.launchMessage, launchable: vm.launchable,
                                btnFav: vm.bookmarked, prevState: $state.$current.name};
            $state.go('course', {courseDetails: courseObject});
        };

        vm.addRemBookmark = function() {
            courseService.addRemFavExalead(vm.id, vm.bookmarked);
            if (vm.bookmarked === 'true') {
                vm.bookmarked = 'false';
            } else if (vm.bookmarked === 'false') {
                vm.bookmarked = 'true';
            }
        };
    }
})();
