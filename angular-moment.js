/* angular-moment.js / v0.1.6 / (c) 2013 Uri Shaked / MIT Licence */

angular.module('angularMoment', [])
	.directive('amTimeAgo', ['$window', '$timeout', function ($window, $timeout) {
		'use strict';

		return function (scope, element, attr) {

			var updateTime, activeTimeout, momentInstance;

			scope.$on('$destroy', function(){ $timeout.cancel(activeTimeout); });

			updateTime = function () {
                		var howOld, secondsUntilUpdate;

				element.text(momentInstance.fromNow());

				howOld = $window.moment().diff(momentInstance, 'minute');
				secondsUntilUpdate = 3600;

				if (howOld < 1) {
					secondsUntilUpdate = 1;
				} else if (howOld < 60) {
					secondsUntilUpdate = 30;
				} else if (howOld < 180) {
					secondsUntilUpdate = 300;
				}

				activeTimeout = $timeout(updateTime, secondsUntilUpdate * 1000, false);
			};

			scope.$watch(attr.amTimeAgo, function (value) {
				if (typeof value === 'undefined' || value === null) {
					return;
				}

				if (angular.isNumber(value)) {
					// Milliseconds since the epoch
					value = new Date(value);
				}
				// else assume the given value is already a date

				if (activeTimeout) {
					$timeout.cancel(activeTimeout);
					activeTimeout = null;
				}

                		momentInstance = $window.moment(value);
				updateTime();
			});
		};
	}]);
