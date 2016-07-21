(function() {
    'use strict';

    /**
     * @name cls.config
     * @description
     * Configuration of application routes, states and i18n
     *
     */
    angular
        .module('cls')
        .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider',
            function($stateProvider,
                     $urlRouterProvider,
                     $translateProvider,
                     $locationProvider) {
                $translateProvider.useStaticFilesLoader({
                    prefix: 'data/i18n/locale-',
                    suffix: '.json'
                });
                $translateProvider.fallbackLanguage('en');
                $translateProvider.preferredLanguage('en');
                $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('home', {
                        url: '/',
                        controller: 'HomeCtrl',
                        templateUrl: 'app/pages/home/home.tmpl.html'
                    })
                    .state('user', {
                        url: '/user',
                        abstract: true,
                        controller: 'UserHomeCtrl',
                        templateUrl: 'app/pages/user-home/user-home.tmpl.html'
                    })
                    .state('user.dashboard', {
                        url: '/',
                        controller: 'ClsHeaderCtrl',
                        templateUrl: 'app/pages/user-home/user-home-dashboard.tmpl.html'
                    })
                    .state('user.assignments', {
                        url: '/assignments',
                        template: '<my-assignments></my-assignments>',
                        params: {title: null, desc: null, rows: 0}
                    })
                    .state('user.library', {
                        url: '/library',
                        template: '<my-library></my-library>',
                        params: {title: null, desc: null, rows: 0}
                    })
                    .state('user.favorites', {
                        url: '/favorites',
                        template: '<my-favorites rows="4"></my-favorites>',
                        params: {title: null, desc: null, rows: 0}
                    })
                    .state('user.training-catalogs', {
                        url: '/catalog',
                        template: '<my-training-catalog></my-training-catalog>',
                        params: {title: null, desc: null, rows: 0}
                    })
                    .state('course', {
                        url: '/course',
                        params: {courseDetails: null},
                        controller: 'CourseMetaDataCtrl',
                        templateUrl: 'app/pages/course-meta-data/course-meta-data.tmpl.html'
                    })
                    .state('publicSearch', {
                        url: '/search/:searchText?',
                        params: {searchObject: null, searchFilters: null,
                                 isUserAuthenticated: null,
                                allTabFilters: null},
                        controller: 'PublicLibraryCtrl',
                        templateUrl: 'app/pages/public-library/public-library.tmpl.html'
                    })
                    .state('privateSearchAll', {
                        url: '/searchAll/:searchText?',
                        params: {searchObject: null, searchFilters: null,
                                 isUserAuthenticated: null,
                                allTabFilters: null},
                        controller: 'PrivateSearchAllCtrl',
                        templateUrl: 'app/pages/private-search-all/private-search-all.tmpl.html'
                    })
                    .state('termOfUse', {
                        url: '/termsOfUse',
                        controller: 'TermsOfUseCtrl',
                        templateUrl: 'app/pages/terms-of-use/terms-of-use.tmpl.html'
                    })
                    .state('changePassword', {
                        url: '/changePassword',
                        controller: 'ChangePasswordCtrl',
                        templateUrl: 'app/pages/change-password/change-password.tmpl.html'
                    })
                    .state('mySettings', {
                        url: '/mySettings',
                        controller: 'MySettingsCtrl',
                        templateUrl: 'app/pages/my-settings/my-settings.tmpl.html'
                    });

                $locationProvider.html5Mode(false);
            }])
        .run(['$document', '$rootScope', function($document, $rootScope) {
            $rootScope.$on('$stateChangeSuccess', function() {
                $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
            });
        }]);
})();
