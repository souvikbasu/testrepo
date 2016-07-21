(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name cls.smartHttp
     * @description
     * Decoration of Angular $http to handle error conditions before returning data
     *
     */
    angular
        .module('cls')
        .factory('smartHttp', ['$http', '$log', '$state', function($http, $log, $state) {
            return {
                get: get,
                post: post
            };


            // Private member definitions
            // ===================================================================================

            /**
             * @ngdoc method
             * @name get
             * @methodOf cls.smartHttp
             * @description
             * HTTP GET call
             *
             * @param {string} url Server endpoint or json path
             * @return {Object} data from server response
             */
            function get(url) {
                if (!url.startsWith('http') && url.endsWith('.json')) {
                    url = appConfig.deploy.cdnPathPrefix + url;
                }

                return $http({
                    method: 'GET',
                    url: url
                })
                    .then(function(response) {
                        var result = response.data;
                        $log.debug('Response from GET ' + url + ': ' + JSON.stringify(result));
                        return response.data;
                    })
                    .catch(function(error) {
                        $log.error('XHR failed for GET on ' + url + '.\n' + error.data);
                        return error;
                    });
            }


            /**
             * @ngdoc method
             * @name post
             * @methodOf cls.smartHttp
             * @description
             * HTTP POST call. If the request is to a json call, it redirects to {@link cls.smartHttp#methods_get get}
             * method
             *
             * @param {string} url Server endpoint or json path
             * @param {Object} data POST params
             * @return {Object} data from server response
             */
            function post(url, data) {
                if (url.endsWith('.json')) {
                    return get(url);
                }

                return $http({
                    method: 'POST',
                    url: url,
                    data: data
                })
                    .then(function(response) {
                        var result = response.data;
                        $log.debug('Response from POST ' + url + ': ' + JSON.stringify(result));
                        if (result === 'loginPage') {
                            $state.go('home');
                            return;
                        }
                        return response.data;
                    })
                    .catch(function(error) {
                        $log.error('XHR failed for POST on ' + url + '.\n' + error.data);
                        return error;
                    });
            }
        }]);
})();
