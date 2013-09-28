/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

/* global describe, inject, module, beforeEach, it, expect, waitsFor, runs, spyOn */

'use strict';

describe('Directive: am-time-ago', function () {
	var $rootScope, $compile, $timeout;

	beforeEach(module('angularMoment'));

	beforeEach(inject(function ($injector) {
		$rootScope = $injector.get('$rootScope');
		$compile = $injector.get('$compile');
		$timeout = $injector.get('$timeout');
	}));

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
			$timeout.flush();
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

	it('should cancel the timer when the scope is destroyed', function () {
		var scope = $rootScope.$new();
		$rootScope.testDate = new Date();
		var element = angular.element('<span am-time-ago="testDate"></span>');
		element = $compile(element)(scope);
		$rootScope.$digest();
		spyOn($timeout, 'cancel').andCallThrough();
		scope.$destroy();
		expect($timeout.cancel).toHaveBeenCalled();
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
});
