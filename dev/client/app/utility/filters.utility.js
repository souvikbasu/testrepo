(function() {
    'use strict';

    angular.module('cls')

        /**
         * @ngdoc filter
         * @name cls.filter:html
         * @description
         * Filter to sanitize html for security
         *
         */
        .filter('html', ['$sce', function($sce) {
            return function(input) {
                return $sce.trustAsHtml(input);
            };
        }])

        /**
         * @ngdoc filter
         * @name cls.filter:html
         * @description
         * Filter to capitalize first letter
         *
         */
        .filter('capitalize', function() {
            return function(input) {
                if (input !== null) {
                    return input.substring(0, 1).toUpperCase() + input.substring(1);
                }
            };
        })

        /**
         * @ngdoc filter
         * @name cls.filter:html
         * @description
         * Filter to change the format of date into javascript readable format
         *
         */
        .filter('formatdate', function() {
            return function(input) {
                if (input !== null) {
                    var tempDate,
                        temp,
                        monthsObj = {
                        Jan: '01', Feb: '02', Mar: '03', Apr: '04',
                        May: '05', Jun: '06', Jul: '07', Aug: '08',
                        Sep: '09', Oct: '10', Nov: '11' , Dec: '12'
                    };
                    temp = input.split(' ');
                    tempDate = temp[0].split('-');
                    if (isNaN(parseInt(tempDate[1]))) {
                        input = tempDate[2] + '-' + monthsObj[tempDate[1]] + '-' +
                            tempDate[0] + ' ' + temp[1];
                        return input;
                    } else {
                        return input;
                    }
                } else {
                    return input;
                }
            };
        })

        /**
         * @ngdoc filter
         * @name cls.filter:html
         * @description
         * Filter to display date in user friendly format
         *
         */
        .filter('timeago', ['formatdateFilter', function(formatdateFilter) {
            return function(input) {
                if (input !== null) {
                    input = formatdateFilter(input);
                    var date,
                        nowTime,
                        dateDifference,
                        preSufStrings,
                        seconds,
                        minutes, parsedMinutes,
                        hours, parsedHours,
                        days, parsedDays,
                        months, parsedMonths,
                        years, parsedYears,
                        words;

                    preSufStrings = {
                        minute: 'a minute',
                        minutes: ' minutes',
                        hour: 'an hour',
                        hours: ' hours',
                        day: 'a day',
                        days: ' days',
                        month: 'a month',
                        months: ' months',
                        years: ' more than a year'
                    };

                    date = new Date();
                    // This has to be handled for Firefox and IE compatibility
                    nowTime = Date.parse(input.split(' ').join('T'));
                    dateDifference = nowTime - date,
                        seconds = Math.abs(dateDifference) / 1000,
                        minutes = seconds / 60,
                        parsedMinutes = parseInt(minutes),
                        hours = minutes / 60,
                        parsedHours = parseInt(hours),
                        days = hours / 24,
                        parsedDays = parseInt(days),
                        years = days / 365,
                        parsedYears = parseInt(years),
                        months = years * 12,
                        parsedMonths = parseInt(months);

                    words = parsedYears >= 1 ?
                        preSufStrings.years : parsedMonths >= 2 ? parsedMonths +
                        preSufStrings.months : parsedMonths === 1 ?
                        preSufStrings.month : parsedDays >= 2 ? parsedDays +
                        preSufStrings.days : parsedDays === 1 ?
                        preSufStrings.day : parsedHours >= 2 ? parsedHours +
                        preSufStrings.hours : parsedHours === 1 ?
                        preSufStrings.hour : parsedMinutes >= 2 ? parsedMinutes +
                        preSufStrings.minutes : preSufStrings.minute;

                    return words;
                } else {
                    return input;
                }
            };
        }]);
})();

