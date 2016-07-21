(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name ng.$log
     * @description
     * Decoration of Angular $log to send logs to server if configured
     *
     */
    angular
        .module('cls')
        .config(['$provide', function($provide) {
            $provide.decorator('$log', ['$delegate', '$injector', 'appConfig', function($delegate,
                                                                                        $injector,
                                                                                        appConfig) {
                var smartHttp,
                    levels = ['debug', 'info', 'warn', 'error'];

                levels.forEach(function(level) {
                    var original = $delegate[level];
                    $delegate[level] = function(data) {
                        if (!smartHttp) {
                            smartHttp = $injector.get('smartHttp');
                        }

                        data = level.toUpperCase() + ': ' + data;
                        original(data);

                        // make server end point call here to store log
                        var logServer = appConfig.logging.logServer;
                        if (logServer) {
                            smartHttp.post(logServer, data);
                        }
                    };
                });

                return $delegate;
            }]);
        }])
        .config(['$logProvider', 'appConfig', function($logProvider, appConfig) {
            $logProvider.debugEnabled(appConfig.logging.enableDebug);
        }]);
})();
