/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

/* global describe, inject, module, beforeEach, afterEach, it, expect, waitsFor, runs, spyOn */

'use strict';

describe('module angularMoment', function () {
	var $rootScope, $compile, $window, amTimeAgoConfig, originalTimeAgoConfig;

	beforeEach(module('angularMoment'));

	beforeEach(inject(function ($injector) {
		$rootScope = $injector.get('$rootScope');
		$compile = $injector.get('$compile');
		$window = $injector.get('$window');
		amTimeAgoConfig = $injector.get('amTimeAgoConfig');
		originalTimeAgoConfig = angular.copy(amTimeAgoConfig);
	}));

	afterEach(function() {
		// Restore original configuration after each test
		amTimeAgoConfig.withoutSuffix = originalTimeAgoConfig.withoutSuffix;
	});

	describe('am-time-ago directive', function () {
		it('should change the text of the element to "a few seconds ago" when given current time', function () {
			$rootScope.testDate = new Date();
			var element = angular.element('<span am-time-ago="testDate"></span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds ago');
		});

		it('should change the text of the div to "3 minutes ago" when given a date 3 minutes ago', function () {
			$rootScope.testDate = new Date(new Date().getTime() - 3 * 60 * 1000);
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('3 minutes ago');
		});

		it('should change the text of the div to "2 hours ago" when given a date 2 hours ago', function () {
			$rootScope.testDate = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('2 hours ago');
		});

		it('should change the text of the div to "one year ago" when given a date one year ago', function () {
			var today = new Date();
			$rootScope.testDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a year ago');
		});

		it('should parse correctly numeric dates as milliseconds since the epoch', function () {
			$rootScope.testDate = new Date().getTime();
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds ago');
		});

		it('should update the value if date changes on scope', function () {
			var today = new Date();
			$rootScope.testDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).getTime();
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a year ago');
			$rootScope.testDate = new Date();
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds ago');
		});

		it('should update the span text as time passes', function () {
			$rootScope.testDate = new Date(new Date().getTime() - 44000);
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds ago');

			waitsFor(function () {
				return (new Date().getTime() - $rootScope.testDate.getTime()) > 45000;
			}, '$rootScope.date is more than 45 seconds old', 1500);

			runs(function () {
				$rootScope.$digest();
				expect(element.text()).toBe('a minute ago');
			});
		});

		it('should handle undefined data', function () {
			$rootScope.testDate = null;
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			var digest = function () {
				$rootScope.$digest();
			};
			expect(digest).not.toThrow();
		});

		it('should remove the element text and cancel the timer when an empty string is given (#15)', function () {
			$rootScope.testDate = new Date().getTime();
			var element = angular.element('<div am-time-ago="testDate"></div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds ago');
			$rootScope.testDate = '';
			spyOn($window, 'clearTimeout').andCallThrough();
			$rootScope.$digest();
			expect($window.clearTimeout).toHaveBeenCalled();
			expect(element.text()).toBe('');
		});

		it('should not change the contents of the element until a date is given', function () {
			$rootScope.testDate = null;
			var element = angular.element('<div am-time-ago="testDate">Initial text</div>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('Initial text');
			$rootScope.testDate = new Date().getTime();
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds ago');
		});

		it('should cancel the timer when the scope is destroyed', function () {
			var scope = $rootScope.$new();
			$rootScope.testDate = new Date();
			var element = angular.element('<span am-time-ago="testDate"></span>');
			element = $compile(element)(scope);
			$rootScope.$digest();
			spyOn($window, 'clearTimeout').andCallThrough();
			scope.$destroy();
			expect($window.clearTimeout).toHaveBeenCalled();
		});

		it('should generate a time string without suffix when configured to do so', function () {
			amTimeAgoConfig.withoutSuffix = true;
			$rootScope.testDate = new Date();
			var element = angular.element('<span am-time-ago="testDate"></span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds');
		});

		describe('am-without-suffix attribute', function () {
			it('should generate a time string without suffix when true', function () {
				$rootScope.testDate = new Date();
				var element = angular.element('<span am-time-ago="testDate" am-without-suffix="true"></span>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				expect(element.text()).toBe('a few seconds');
			});

			it('should generate a time string with suffix when false', function () {
				amTimeAgoConfig.withoutSuffix = true;
				$rootScope.testDate = new Date();
				var element = angular.element('<span am-time-ago="testDate" am-without-suffix="false"></span>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				expect(element.text()).toBe('a few seconds ago');
			});

			it('should support expressions', function () {
				$rootScope.testDate = new Date();
				$rootScope.withSuffix = false;
				var element = angular.element('<span am-time-ago="testDate" am-without-suffix="!withSuffix"></span>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				expect(element.text()).toBe('a few seconds');
				$rootScope.withSuffix = true;
				$rootScope.$digest();
				expect(element.text()).toBe('a few seconds ago');
			});

			it('should ignore non-boolean values', function () {
				$rootScope.testDate = new Date();
				$rootScope.withoutSuffix = 'string';
				var element = angular.element('<span am-time-ago="testDate" am-without-suffix="withoutSuffix"></span>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				expect(element.text()).toBe('a few seconds ago');
			});
		});

		describe('am-format attribute', function () {
			it('should support custom date format', function () {
				var today = new Date();
				$rootScope.testDate = today.getFullYear() + '#' + today.getDate() + '#' + today.getMonth();
				var element = angular.element('<span am-time-ago="testDate" am-format="YYYY#DD#MM"></span>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				expect(element.text()).toBe('a month ago');
			});

			it('should support angular expressions in date format', function () {
				var today = new Date();
				$rootScope.testDate = today.getMonth() + '@' + today.getFullYear() + '@' + today.getDate();
				var element = angular.element('<span am-time-ago="testDate" am-format="{{dateFormat}}"></span>');
				element = $compile(element)($rootScope);
				$rootScope.$digest();
				$rootScope.dateFormat = 'MM@YYYY@DD';
				$rootScope.$digest();
				expect(element.text()).toBe('a month ago');
			});
		});
	});

	describe('amCalendar filter', function () {
		it('should convert today date to calendar form', function () {
			var today = new Date();
			$rootScope.testDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 33, 33);
			var element = angular.element('<span>{{testDate|amCalendar}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('Today at 1:33 PM');
		});

		it('should convert date in long past to calendar form', function () {
			$rootScope.testDate = new Date(2012, 2, 25, 13, 14, 15);
			var element = angular.element('<span>{{testDate|amCalendar}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('03/25/2012');
		});

		it('should gracefully handle undefined values', function () {
			var element = angular.element('<span>{{undefinedDate|amCalendar}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('');
		});

		it('should accept a numeric unix timestamp (milliseconds since the epoch) as input', function () {
			$rootScope.testTimestamp = new Date(2012, 0, 22, 12, 46, 54).getTime();
			var element = angular.element('<span>{{testTimestamp|amCalendar}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('01/22/2012');
		});
	});

	describe('amDateFormat filter', function () {
		it('should support displaying format', function () {
			var today = new Date();
			$rootScope.testDate = today;
			var element = angular.element('<span>{{testDate|amDateFormat:\'D.M.YYYY\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe(today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear());
		});

		it('should gracefully handle undefined values', function () {
			var element = angular.element('<span>{{testDate|amDateFormat:\'D.M.YYYY\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('');
		});

		it('should accept a numeric unix timestamp (milliseconds since the epoch) as input', function () {
			$rootScope.testTimestamp = new Date(2012, 0, 22, 12, 46, 54).getTime();
			var element = angular.element('<span>{{testTimestamp|amDateFormat:\'(HH,mm,ss);MM.DD.YYYY\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('(12,46,54);01.22.2012');
		});

		it('should gracefully handle string unix timestamp as input', function () {
			$rootScope.testTimestamp = String(new Date(2012, 0, 22, 12, 46, 54).getTime());
			var element = angular.element('<span>{{testTimestamp|amDateFormat:\'(HH,mm,ss);MM.DD.YYYY\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('(12,46,54);01.22.2012');
		});
	});

	describe('amDurationFormat filter', function () {
		it('should support displaying format in milliseconds', function () {
			$rootScope.testDate = 1000;
			var element = angular.element('<span>{{testDate|amDurationFormat:\'milliseconds\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a few seconds');
		});

		it('should support give a day with 24 hours', function () {
			$rootScope.testDate = 24;
			var element = angular.element('<span>{{testDate|amDurationFormat:\'hours\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a day');
		});

		it('should support suffix or not within duration: 1 minute', function () {
			$rootScope.testDate = 1;
			var element = angular.element('<span>{{testDate|amDurationFormat:\'minutes\':true}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('in a minute');
		});

		it('should support suffix or not within a negative duration: 1 minute', function () {
			$rootScope.testDate = -1;
			var element = angular.element('<span>{{testDate|amDurationFormat:\'minutes\':true}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('a minute ago');
		});

		it('should gracefully handle undefined values for duration', function () {
			var element = angular.element('<span>{{testDate|amDurationFormat:\'D.M.YYYY\'}}</span>');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('');
		});
	});


	describe('amTimeAgoConfig constant', function () {
		it('should generate time with suffix by default', function () {
			expect(amTimeAgoConfig.withoutSuffix).toBe(false);
		});
	});

});
