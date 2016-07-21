(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.courseService
     * @description
     * Service to return course related data
     *
     */
    angular
        .module('cls')
        .factory('courseService', ['smartHttp', '$q', 'appConfig', courseService]);

    function courseService(smartHttp, $q, appConfig) {
        var allCourses = null;

        return {
            getProductAndIndustryCategoryList: getProductAndIndustryCategoryList,
            searchFromCourseList: searchFromCourseList,
            searchCourses: searchCourses,
            privateSearchCourses: privateSearchCourses,
            getTopFavoriteCourses: getTopFavoriteCourses,
            getLibraryCourses: getLibraryCourses,
            getNextFavoriteCourses: getNextFavoriteCourses,
            getCourseMetaData: getCourseMetaData,
            showPlayerWindow: showPlayerWindow,
            addRemoveFav: addRemoveFav,
            getSortedFavoriteCourses: getSortedFavoriteCourses,
            getAllFilters: getAllFilters,
            getAllCourses: getAllCourses,
            getExaleadFilters: getExaleadFilters,
            addRemFavExalead: addRemFavExalead,
            requestLicenseInLibrary: requestLicenseInLibrary,
            exaleadScreenLaunch: exaleadScreenLaunch
        };


        // Private member definitions
        // ===================================================================================

        /**
         * @ngdoc method
         * @name getProductAndIndustryCategoryList
         * @methodOf cls.courseService
         * @description
         * Get all Product and Industry category list
         *
         * @return {Promise} On success the promise will be resolved with category list for industry and product
         */
        function getProductAndIndustryCategoryList() {
            return smartHttp.get(appConfig.serviceEndPoints.homeData);
        }


        /**
         * @ngdoc method
         * @name searchFromCourseList
         * @methodOf cls.courseService
         * @description
         * Search courses matching the search text. Only course title is matched
         *
         * @param {string} searchText Search string to match
         * @return {Promise} On success the promise will be resolved with Courses matching search text
         */
        function searchFromCourseList(searchText) {
            if (allCourses) {
                var def = $q.defer(),
                    searchResult = [];
                allCourses.forEach(function(course) {
                    if (course.lObjTit.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        searchResult.push(course);
                    }
                });
                def.resolve(searchResult);
                return def.promise;
            }

            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.fullCourseList, {})
                .then(function(courses) {
                    var searchResult = [];
                    allCourses = courses;
                    if (allCourses) {
                        allCourses.forEach(function(course) {
                            if (course.lObjTit.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                                searchResult.push(course);
                            }
                        });
                    }
                    return searchResult;
                });
        }


        /**
         * @ngdoc method
         * @name searchCourses
         * @methodOf cls.courseService
         * @description
         * Search courses matching the search text. This is a detailed course search
         *
         * @param {string} searchText Search string to match
         * @param {int} from Index of starting course
         * @param {int} size Number of courses to return
         * @param {int} brandId to search all the courses for particular brand
         * @param {int} industryId to search all the courses for particular industry
         * @return {Promise} On success the promise will be resolved with Courses matching search text
         */
        function searchCourses(searchText, from, size, brandId, industryId) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.searchCourses, {
                searchStr: searchText,
                index: from,
                limit: size,
                brId: brandId,
                indId: industryId
            });
        }


        /**
         * @ngdoc method
         * @name privateSearchCourses
         * @methodOf cls.courseService
         * @description
         * Private search courses matching the search text. This is a detailed course search
         *
         * @param {int} from Index of starting course
         * @param {int} size Number of courses to return
         * @param {string} searchText Search string to match
         * @return {Promise} On success the promise will be resolved with Courses matching search text
         */
        function privateSearchCourses(from, size, searchText) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.privateSearch, {
                index: from,
                limit: size,
                searchStr: searchText
            });
        }


        /**
         * @ngdoc method
         * @name getLibraryCourses
         * @methodOf cls.courseService
         * @description
         * Get next set of library courses for the user
         *
         * @param {int} from Index of starting course
         * @param {int} size Number of courses to return
         * @return {Promise} On success the promise will be resolved with Courses matching search text
         */
        function getLibraryCourses(from, size) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.library, {
                index: from,
                limit: size
            });
        }

        /**
         * @ngdoc method
         * @name getTopFavoriteCourses
         * @methodOf cls.courseService
         * @description Get top favorites courses for the user. The result is cached for later reuse
         *
         * @param {int} size Number of courses to return
         * @return {Promise} On success the promise will be resolved with top favorite Courses for the user
         **/
        function getTopFavoriteCourses(size) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.favorites, {
                index: 0,
                limit: size
            });
        }

        /**
         * @ngdoc method
         * @name getNextFavoriteCourses
         * @methodOf cls.courseService
         * @description
         * Get next set of favorite courses for the user
         *
         * @param {int} from Index of starting course
         * @param {int} size Number of courses to return
         * @return {Promise} On success the promise will be resolved with Courses matching search text
         */
        function getNextFavoriteCourses(from, size) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.favorites, {
                index: from,
                limit: size
            });
        }

        /**
         * @ngdoc method
         * @name showPlayerWindow
         * @methodOf cls.courseService
         * @description
         * Get the course URL
         *
         * @param {int} lobjId Learning Object ID of course
         * @param {int} lcoId id of the lco of the course
         * @param {string} lan language of course
         * @return {Promise} On success the promise will be resolved with Course URL
         **/
        function showPlayerWindow(lobjId, lcoId, lan, pId) {
            if (pId) {
                return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.lnchURLs, {
                    courseId: lobjId,
                    lang: lan,
                    lcoId: lcoId,
                    pId: pId
                });
            } else {
                return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.lnchURLs, {
                    courseId: lobjId,
                    lang: lan,
                    lcoId: lcoId
                });
            }
        }

        /**
         * @ngdoc method
         * @name addRemoveFav
         * @methodOf cls.courseService
         * @description
         * Get the courses after removing favorite tag
         *
         * @param {int} lobjId Learning Object ID of course
         * @param {boolean} isFav favorite flag of course
         * @return {Promise} On success the promise will be resolved with database update
         **/
        function addRemoveFav(lobjId, isFav) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.addRemFavorite, {
                courseId: lobjId,
                bookmarked: isFav
            });
        }

        /**
         * @ngdoc method
         * @name getSortedFavoriteCourses
         * @methodOf cls.courseService
         * @description
         * Get the courses after applyting sort by
         *
         * @param {string} sortParam sorting parameter of course
         * @return {Promise} On success the promise will be resolved with Sorted Course data
         **/
        function getSortedFavoriteCourses(sortParam) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.favorites, {
                sortBy: sortParam
            });
        }

        /**
         * @ngdoc method
         * @name getCourseMetaData
         * @methodOf cls.courseService
         * @description
         * Get course meta data
         *
         * @return {Promise} On success the promise will be resolved with Course
         */
        function getCourseMetaData(courseDetails) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.courseMetaData, {
                lang: courseDetails.lang,
                lId: courseDetails.lId,
                lmsg: courseDetails.lmsg,
                launchable: courseDetails.launchable,
                btnFav: courseDetails.btnFav
            });
        }

        /**
         * @ngdoc method
         * @name getAllFilters
         * @methodOf cls.courseService
         * @description
         * Get list of all filters
         *
         * @return {Promise} On success the promise will be resolved with filters list
         */
        function getAllFilters() {
            return smartHttp.get(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.courseFilters);
        }

        /**
         * @ngdoc method
         * @name getAllCourses
         * @methodOf cls.courseService
         * @description
         * Get list of all tab results in private search
         *
         * @return {Promise} On success the promise will be resolved with courses list
         */
        function getAllCourses(searchStr, pageIndex, fCriteria) {
            return smartHttp.post(appConfig.deploy.envPathPrefix +
            appConfig.serviceEndPoints.privateSearchAll, {
                searchStr: searchStr,
                pageIndex: pageIndex,
                fCriteria: fCriteria
            });
        }

        /**
         * @ngdoc method
         * @name getExaleadFilters
         * @methodOf cls.courseService
         * @description
         * Get list of all tab's filters
         *
         * @return {Promise} On success the promise will be resolved with filter list
         */
        function getExaleadFilters() {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.exaleadFilters);
        }

        /**
         * @ngdoc method
         * @name addRemFavExalead
         * @methodOf cls.courseService
         * @description
         * Add or Remove exalead search result bookmark
         *
         * @return {Promise} On success the promise will be resolved
         */
        function addRemFavExalead(lId, bookmarked) {
            return smartHttp.post(appConfig.deploy.envPathPrefix +
            appConfig.serviceEndPoints.addRemFavExalead, {
                lId: lId,
                bookmarked: bookmarked
            });
        }

        /**
         * @ngdoc method
         * @name requestLicenseInLibrary
         * @methodOf cls.courseService
         * @description
         * Request License in Library
         *
         * @return {Promise} On success the promise will be resolved
         */
        function requestLicenseInLibrary(vId, lObjId) {
            return smartHttp.post(appConfig.deploy.envPathPrefix +
            appConfig.serviceEndPoints.requestLicenseInLibrary, {
                vId: vId,
                lObjId: lObjId
            });
        }

        /**
         * @ngdoc method
         * @name exaleadScreenLaunch
         * @methodOf cls.courseService
         * @description
         * Lauch exalead search result screen
         *
         * @return {Promise} On success the promise will be resolved
         */
        function exaleadScreenLaunch(lId, lcoId, skUid, scrUid, cw, lang) {
            return smartHttp.post(appConfig.deploy.envPathPrefix +
            appConfig.serviceEndPoints.exaleadScreenLaunch, {
                lId: lId,
                lcoId: lcoId,
                skUid: skUid,
                scrUid: scrUid,
                cw: cw,
                lang: lang
            });
        }
    }
})();
