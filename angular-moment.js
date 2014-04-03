/* angular-moment.js / v0.6.2 / (c) 2013, 2014 Uri Shaked / MIT Licence */

/* global define */

(function () {
	'use strict';

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
			.directive('amTimeAgo', ['$window', 'moment', 'amMoment', 'amTimeAgoConfig', 'angularMomentConfig', function ($window, moment, amMoment, amTimeAgoConfig, angularMomentConfig) {

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

						currentValue = amMoment.preprocessDate(value, preprocess);
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

			.service('amMoment', ['moment', '$rootScope', '$log', 'angularMomentConfig', function (moment, $rootScope, $log, angularMomentConfig) {
				this.preprocessors = {
					utc: moment.utc,
					unix: moment.unix
				};

				this.changeLanguage = function (lang) {
					var result = moment.lang(lang);
					if (angular.isDefined(lang)) {
						$rootScope.$broadcast('amMoment:languageChange');
					}
					return result;
				};

				this.preprocessDate = function (value, preprocess) {
					if (this.preprocessors[preprocess]) {
						return this.preprocessors[preprocess](value);
					}
					if (preprocess) {
						$log.warn('angular-moment: Ignoring unsupported value for preprocess: ' + preprocess);
					}
					if (!isNaN(parseFloat(value)) && isFinite(value)) {
						// Milliseconds since the epoch
						return new Date(parseInt(value, 10));
					}
					// else just returns the value as-is.
					return value;
				};

				/**
				 * Apply a timezone onto a given moment object - if moment-timezone.js is included
				 * Otherwise, it'll not apply any timezone shift.
				 * @param {Moment} aMoment a moment() instance to apply the timezone shift to
				 * @returns {Moment} The given moment with the timezone shift applied
				 */
				this.applyTimezone = function (aMoment) {
					var timezone = angularMomentConfig.timezone;
					if (aMoment && timezone) {
						if (aMoment.tz) {
							aMoment = aMoment.tz(timezone);
						} else {
							$log.warn('angular-moment: timezone specified but moment.tz() is undefined. Did you forget to include moment-timezone.js?');
						}
					}
					return aMoment;
				};
			}])

			.filter('amCalendar', ['moment', 'amMoment', function (moment, amMoment) {
				return function (value, preprocess) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					value = amMoment.preprocessDate(value, preprocess);
					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					return amMoment.applyTimezone(date).calendar();
				};
			}])

			.filter('amDateFormat', ['moment', 'amMoment', function (moment, amMoment) {
				return function (value, format, preprocess) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					value = amMoment.preprocessDate(value, preprocess);
					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					return amMoment.applyTimezone(date).format(format);
				};
			}])

			.filter('amDurationFormat', ['moment', function (moment) {
				return function (value, format, suffix) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

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
