// angular-moment.js / v0.1.3 / (c) 2013 Uri Shaked / MIT Licence

angular.module('angularMoment', [])
	.directive('amTimeAgo', function ($timeout) {
		'use strict';

		return function (scope, element, attr) {
			var activeTimeout = null;
		
			function updateTime(momentInstance) {
				element.text(momentInstance.fromNow());
				var howOld = moment().diff(momentInstance, 'minute');
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
				}, secondsUntilUpdate * 1000);
			}

			scope.$watch(attr.amTimeAgo, function (value) {
				if (angular.isNumber(value)) {
					// Milliseconds since the epoch
					value = new Date(value);
				}
				else if (angular.isString(value)) {
					// Using array to build a Date object no matter of the browser (iPhone fix)
					// solution taken from: http://stackoverflow.com/questions/5324178/javascript-date-parsing-on-iphone
					var arr = value.toString().split(/[- :]/);
					value = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
				}
				// else assume the given value is already a date

				if (activeTimeout) {
					$timeout.cancel(activeTimeout);
					activeTimeout = null;
				}
				updateTime(moment(value));
			});
		};
	});
