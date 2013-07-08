/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

module.exports = function (grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'angular-moment.js',
				'tests.js'
			]
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
		'jshint',
		'karma'
	]);

	grunt.registerTask('build', [
		'ngmin',
		'jshint',
		'uglify'
	]);

	grunt.registerTask('default', ['build']);
};
