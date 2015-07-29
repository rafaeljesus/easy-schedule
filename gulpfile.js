'use strict';

const gulp      = require('gulp')
  , plugins     = require('gulp-load-plugins')();

gulp.task('lint', function() {
  let src = [
    './api/**/*.js',
    './middlewares/**/*.js',
    './lib/**/*.js',
    './test/**/*spec.js',
    './bin/easy.schedule.js',
    'gulpfile.js',
    'app.js'
  ];
  return gulp.src(src)
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

gulp.task('default', ['lint', 'test']);
