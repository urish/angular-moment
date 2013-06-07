// angular-moment.js / v0.1.0 / (c) 2013 Uri Shaked / Apache License

angular.module('angularMoment', [])
	.directive('amTimeAgo', function ($timeout) {
		return function (scope, element, attr) {
			function updateTime(momentInstance) {
				element.text(momentInstance.fromNow());
				var howOld = moment().diff(momentInstance, "minute");
				var secondsUntilUpdate = 3600;
				if (howOld < 1) {
					secondsUntilUpdate = 1;
				} else if (howOld < 60) {
					secondsUntilUpdate = 30;
				} else if (howOld < 180) {
					secondsUntilUpdate = 300;
				}

				$timeout(function () {
					updateTime(momentInstance);
				}, secondsUntilUpdate * 1000);
			}

			scope.$watch(attr.amTimeAgo, function (value) {
				// Using array to build a Date object no matter of the browser (iPhone fix)
				// solution taken from: http://stackoverflow.com/questions/5324178/javascript-date-parsing-on-iphone
				
				var arr = value.toString().split(/[- :]/),
				    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

				if (!(value instanceof Date)) {
					value = new Date(date);
				}

				updateTime(moment(value));
			});
		}
	});
