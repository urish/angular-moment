/* License: MIT.
 * Copyright (C) 2013, 2014, Uri Shaked.
 */

'use strict';

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		logLevel: config.LOG_INFO,
		browsers: ['PhantomJS'],
		autoWatch: true,
		reporters: ['dots', 'coverage'],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/moment/moment.js',
			'bower_components/moment/lang/fr.js',
			'bower_components/moment-timezone/moment-timezone.js',
			'angular-moment.js',
			'tests.js'
		],
		preprocessors: {
			'angular-moment.js': 'coverage'
		},
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		}
	});
};
