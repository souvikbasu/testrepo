(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.programService
     * @description
     * Service to return program related data
     *
     */
    angular
        .module('cls')
        .factory('programService', ['smartHttp', 'appConfig', programService]);

    function programService(smartHttp, appConfig) {
        return {
            getLatestMyAssignments: getLatestMyAssignments,
            getLatestMyTrainingCatalog: getLatestMyTrainingCatalog,
            getNextTrainingCatalog: getNextTrainingCatalog,
            getNextAssignments: getNextAssignments,
            getTrainingCatalogCourseDetails: getTrainingCatalogCourseDetails,
            getAssignmentsDetails: getAssignmentsDetails,
            getSortedAssignments: getSortedAssignments,
            getPdfDetails: getPdfDetails
        };


        // Private member definitions
        // ===================================================================================

        /**
         * @ngdoc method
         * @name getLatestMyAssignments
         * @methodOf cls.programService
         * @description
         * Get latest assignments for the user
         *
         * @param {int} size Number of assignments to return
         * @return {Promise} On success the promise will be resolved with list of assignments for the user
         */
        function getLatestMyAssignments(size) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.assignments, {
                index: 0,
                limit: size
            });
        }

        /**
         * @ngdoc method
         * @name getSortedAssignments
         * @methodOf cls.courseService
         * @description
         * Get the assignments after applyting sort by
         *
         * @param {string} sortParam sorting parameter of course
         * @return {Promise} On success the promise will be resolved with Sorted Course data
         **/
        function getSortedAssignments(sortParam) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.assignments, {
                sortBy: sortParam
            });
        }

        /**
         * @ngdoc method
         * @name getLatestMyTrainingCatalog
         * @methodOf cls.programService
         * @description
         * Get latest training catalog for the user
         *
         * @return {Promise} On success the promise will be resolved with list of training catalogs for the user
         */
        function getLatestMyTrainingCatalog(from, size) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.trainingCatalog, {
                index: from,
                limit: size
            });
        }

        /**
         * @ngdoc method
         * @name getNextTrainingCatalog
         * @methodOf cls.programService
         * @description
         * Get next set of training catalogs for the user
         *
         * @param {int} from Index of starting course
         * @param {int} size Number of courses to return
         * @return {Promise} On success the promise will be resolved with more training catalogs
         */
        function getNextTrainingCatalog(from, size) {
            return smartHttp
                .post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.trainingCatalog,
                    {
                        index: from,
                        limit: size
                    });
        }

        /**
         * @ngdoc method
         * @name getNextAssignments
         * @methodOf cls.programService
         * @description
         * Get next set of assignments for the user
         *
         * @param {int} from Index of starting course
         * @param {int} size Number of courses to return
         * @return {Promise} On success the promise will be resolved with more assignments
         */
        function getNextAssignments(from, size) {
            return smartHttp
                .post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.assignments,
                    {
                        index: from,
                        limit: size
                    });
        }

        /**
         * @ngdoc method
         * @name getTrainingCatalogCourseDetails
         * @methodOf cls.programService
         * @description
         * Get course details for selected course
         *
         * @return {Promise} On success the promise will be resolved with Course details for selected course
         */
        function getTrainingCatalogCourseDetails(programId) {
            return smartHttp.post(appConfig.deploy.envPathPrefix + appConfig.serviceEndPoints.trainingCatalogLevel2,
                {
                    programId: programId
                });
        }

        /**
         * @ngdoc method
         * @name getAssignmentsDetails
         * @methodOf cls.programService
         * @description
         * Get course details for selected course
         *
         * @return {Promise} On success the promise will be resolved with Course details for selected course
         */
        function getAssignmentsDetails(programId) {
            return smartHttp.post(appConfig.deploy.envPathPrefix +
                appConfig.serviceEndPoints.assignmentLevel2,
                {
                    programId: programId
                });
        }

        /**
         * @ngdoc method
         * @name getPdfDetails
         * @methodOf cls.programService
         * @description
         * Get pdf details for selected course
         *
         * @return {Promise} On success the promise will be resolved with pdf details for selected course
         */
        function getPdfDetails(courseId, programId) {
            return smartHttp.get(appConfig.deploy.envPathPrefix +
                appConfig.serviceEndPoints.getPdfDetails,
                {
                    lobjId: courseId,
                    pId: programId
                });
        }
    }
})();
