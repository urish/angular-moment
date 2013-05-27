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
				if (!(value instanceof Date)) {
					value = new Date(value);
				}

				updateTime(moment(value));
			});
		}
	});
