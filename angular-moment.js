/* angular-moment.js / v0.6.2 / (c) 2013, 2014 Uri Shaked / MIT Licence */

/* global define */

(function () {
	'use strict';

	/**
	 * Apply a timezone onto a given moment object - if moment-timezone.js is included
	 * Otherwise, it'll not apply any timezone shift.
	 * @param {Moment} aMoment
	 * @param {string} timezone
	 * @returns {Moment}
	 */
	function applyTimezone(aMoment, timezone, $log) {
		if (aMoment && timezone) {
			if (aMoment.tz) {
				aMoment = aMoment.tz(timezone);
			} else {
				$log.warn('angular-moment: timezone specified but moment.tz() is undefined. Did you forget to include moment-timezone.js?');
			}
		}
		return aMoment;
	}

	function angularMoment(angular, moment) {

		return angular.module('angularMoment', [])

		/**
		 * Common configuration of the angularMoment module
		 */
			.constant('angularMomentConfig', {
				preprocess: null, // e.g. 'unix', 'utc', ...
				timezone: '' // e.g. 'Europe/London'
			})

		/**
		 * moment.js global
		 */
			.constant('moment', moment)

		/**
		 * configuration specific to the amTimeAgo directive
		 */
			.constant('amTimeAgoConfig', { withoutSuffix: false})

		/**
		 * amTimeAgo directive
		 */
			.directive('amTimeAgo', ['$window', 'moment', 'amTimeAgoConfig', 'angularMomentConfig', function ($window, moment, amTimeAgoConfig, angularMomentConfig) {

				return function (scope, element, attr) {
					var activeTimeout = null;
					var currentValue;
					var currentFormat;
					var withoutSuffix = amTimeAgoConfig.withoutSuffix;
					var preprocess = angularMomentConfig.preprocess;
					
					if (attr.amPreprocess) {
						preprocess = attr.amPreprocess;
					}

					function cancelTimer() {
						if (activeTimeout) {
							$window.clearTimeout(activeTimeout);
							activeTimeout = null;
						}
					}

					function updateTime(momentInstance) {
						element.text(momentInstance.fromNow(withoutSuffix));
						var howOld = moment().diff(momentInstance, 'minute');
						var secondsUntilUpdate = 3600;
						if (howOld < 1) {
							secondsUntilUpdate = 1;
						} else if (howOld < 60) {
							secondsUntilUpdate = 30;
						} else if (howOld < 180) {
							secondsUntilUpdate = 300;
						}

						activeTimeout = $window.setTimeout(function () {
							updateTime(momentInstance);
						}, secondsUntilUpdate * 1000);
					}

					function updateMoment() {
						cancelTimer();
						updateTime(moment(currentValue, currentFormat));
					}

					scope.$watch(attr.amTimeAgo, function (value) {
						if ((typeof value === 'undefined') || (value === null) || (value === '')) {
							cancelTimer();
							if (currentValue) {
								element.text('');
								currentValue = null;
							}
							return;
						}

						if (preprocess) {
							value = moment[preprocess](value);
						} else if (angular.isNumber(value)) {
							// Milliseconds since the epoch
							value = new Date(value);
						}
						// else assume the given value is already a date

						currentValue = value;
						updateMoment();
					});

					if (angular.isDefined(attr.amWithoutSuffix)) {
						scope.$watch(attr.amWithoutSuffix, function (value) {
							if (typeof value === 'boolean') {
								withoutSuffix = value;
								updateMoment();
							} else {
								withoutSuffix = amTimeAgoConfig.withoutSuffix;
							}
						});
					}

					attr.$observe('amFormat', function (format) {
						currentFormat = format;
						if (currentValue) {
							updateMoment();
						}
					});

					scope.$on('$destroy', function () {
						cancelTimer();
					});

					scope.$on('amMoment:languageChange', function () {
						updateMoment();
					});
				};
			}])

		/**
		 * amTimeAgoUtc directive
		 */
			.directive('amTimeAgoUtc', ['$window', 'moment', 'amTimeAgoConfig', function ($window, moment, amTimeAgoConfig) {

				return function (scope, element, attr) {
					var activeTimeout = null;
					var currentValue;
					var currentFormat;
					var withoutSuffix = amTimeAgoConfig.withoutSuffix;

					function cancelTimer() {
						if (activeTimeout) {
							$window.clearTimeout(activeTimeout);
							activeTimeout = null;
						}
					}

					function updateTime(momentInstance) {
						element.text(momentInstance.fromNow(withoutSuffix));
						var howOld = moment.utc().diff(momentInstance, 'minute');
						var secondsUntilUpdate = 3600;
						if (howOld < 1) {
							secondsUntilUpdate = 1;
						} else if (howOld < 60) {
							secondsUntilUpdate = 30;
						} else if (howOld < 180) {
							secondsUntilUpdate = 300;
						}

						activeTimeout = $window.setTimeout(function () {
							updateTime(momentInstance);
						}, secondsUntilUpdate * 1000);
					}

					function updateMoment() {
						cancelTimer();
						updateTime(moment.utc(currentValue, currentFormat));
					}

					scope.$watch(attr.amTimeAgoUtc, function (value) {
						if ((typeof value === 'undefined') || (value === null) || (value === '')) {
							cancelTimer();
							if (currentValue) {
								element.text('');
								currentValue = null;
							}
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

					if (angular.isDefined(attr.amWithoutSuffix)) {
						scope.$watch(attr.amWithoutSuffix, function (value) {
							if (typeof value === 'boolean') {
								withoutSuffix = value;
								updateMoment();
							} else {
								withoutSuffix = amTimeAgoConfig.withoutSuffix;
							}
						});
					}

					attr.$observe('amFormat', function (format) {
						currentFormat = format;
						if (currentValue) {
							updateMoment();
						}
					});

					scope.$on('$destroy', function () {
						cancelTimer();
					});

					scope.$on('amMoment:languageChange', function () {
						updateMoment();
					});
				};
			}])

			.service('amMoment', ['moment', '$rootScope', function (moment, $rootScope) {
				this.changeLanguage = function (lang) {
					var result = moment.lang(lang);
					if (angular.isDefined(lang)) {
						$rootScope.$broadcast('amMoment:languageChange');
					}
					return result;
				};
			}])

			.filter('amCalendar', ['moment', '$log', 'angularMomentConfig', function (moment, $log, angularMomentConfig) {
				return function (value) {
					var preprocess = angularMomentConfig.preprocess;
					
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					if (preprocess) {
						value = moment[preprocess](value);
					} else if (!isNaN(parseFloat(value)) && isFinite(value)) {
						// Milliseconds since the epoch
						value = new Date(parseInt(value, 10));
					}

					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					return applyTimezone(date, angularMomentConfig.timezone, $log).calendar();
				};
			}])

			.filter('amDateFormat', ['moment', '$log', 'angularMomentConfig', function (moment, $log, angularMomentConfig) {
				return function (value, format) {
					var preprocess = angularMomentConfig.preprocess;
					
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					if (preprocess) {
						value = moment[preprocess](value);
					} else if (!isNaN(parseFloat(value)) && isFinite(value)) {
						// Milliseconds since the epoch
						value = new Date(parseInt(value, 10));
					}

					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					return applyTimezone(date, angularMomentConfig.timezone, $log).format(format);
				};
			}])

			.filter('amDurationFormat', ['moment', function (moment) {
				return function (value, format, suffix) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					// else assume the given value is already a duration in a format (miliseconds, etc)
					return moment.duration(value, format).humanize(suffix);
				};
			}]);
	}

	if (typeof define === 'function' && define.amd) {
		define('angular-moment', ['angular', 'moment'], angularMoment);
	} else {
		angularMoment(angular, window.moment);
	}
})();
