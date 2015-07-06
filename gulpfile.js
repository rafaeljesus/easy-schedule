'use strict';

var gulp      = require('gulp')
  , plugins   = require('gulp-load-plugins')();

gulp.task('lint', function() {
  return gulp.src(['./api/**/*.js', './test/**/*spec.js', 'gulpfile.js', 'api.js'])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('test', function() {
  return gulp.src('./api/**/*.js')
    .pipe(plugins.istanbul({includeUntested: true}))
    .pipe(plugins.istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(['./test/**/*spec.js'])
      .pipe(plugins.mocha({timeout: 5000}))
        .pipe(plugins.istanbul.writeReports())
        .once('end', function() {
          process.exit();
        })
        .on('error', function() {
          process.exit(1);
        });
    });
});
