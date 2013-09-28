/* angular-moment.js / v0.2.2 / (c) 2013 Uri Shaked / MIT Licence */

angular.module('angularMoment', [])
	.directive('amTimeAgo', ['$window', '$timeout', function ($window, $timeout) {
		'use strict';

		return function (scope, element, attr) {
			var activeTimeout = null;
			var currentValue;
			var currentFormat;

			function cancelTimer() {
				if (activeTimeout) {
					$timeout.cancel(activeTimeout);
					activeTimeout = null;
				}
			}

			function updateTime(momentInstance) {
				element.text(momentInstance.fromNow());
				var howOld = $window.moment().diff(momentInstance, 'minute');
				var secondsUntilUpdate = 3600;
				if (howOld < 1) {
					secondsUntilUpdate = 1;
				} else if (howOld < 60) {
					secondsUntilUpdate = 30;
				} else if (howOld < 180) {
					secondsUntilUpdate = 300;
				}

				activeTimeout = $timeout(function () {
					updateTime(momentInstance);
				}, secondsUntilUpdate * 1000, false);
			}

			function updateMoment() {
				cancelTimer();
				updateTime($window.moment(currentValue, currentFormat));
			}

			scope.$watch(attr.amTimeAgo, function (value) {
				if (typeof value === 'undefined' || value === null) {
					return;
				}

				if (angular.isNumber(value)) {
					// Milliseconds since the epoch
					value = new Date(value);
				}
				// else assume the given value is already a date

				currentValue = value;
				updateMoment();
			});

			attr.$observe('amFormat', function (format) {
				currentFormat = format;
				updateMoment();
			});

			scope.$on('$destroy', function () {
				cancelTimer();
			});
		};
	}])
	.filter('amDateFormat', ['$window', function ($window) {
		'use strict';

		return function (value, format) {
			if (typeof value === 'undefined' || value === null) {
				return '';
			}

			if(!isNaN(parseFloat(value)) && isFinite(value)) {
				// Milliseconds since the epoch
				value = new Date(parseInt(value, 10));
			}
			// else assume the given value is already a date

			return $window.moment(value).format(format);
		};
	}]);
