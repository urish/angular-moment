/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

module.exports = function (grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	var path = require('path');

	grunt.initConfig({
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		ngmin: {
			dist: {
				files: [
					{
						src: 'angular-moment.js',
						dest: 'angular-moment.min.js'
					}
				]
			}
		},
		uglify: {
			dist: {
				files: {
					'angular-moment.min.js': 'angular-moment.min.js'
				}
			}
		}
	});

	grunt.registerTask('test', [
		'karma'
	]);

	grunt.registerTask('build', [
		'ngmin',
		'uglify'
	]);

	grunt.registerTask('default', ['build']);
};
