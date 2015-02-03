/**
 * Requires gulp
 */
var gulp = require('gulp');


/**
 * Requires gulp dependencies
 */
var browser    = require('browser-sync');
var concat     = require('gulp-concat');
var imagemin   = require('gulp-imagemin');
var jeet       = require('jeet');
var jshint     = require('gulp-jshint');
var kouto      = require('kouto-swiss');
var plumber    = require('gulp-plumber');
var reload     = browser.reload;
var rupture    = require('rupture');
var sourcemaps = require('gulp-sourcemaps');
var spawn      = require('child_process').spawn;
var stylish    = require('jshint-stylish');
var stylus     = require('gulp-stylus');
var uglify     = require('gulp-uglify');
var watch      = require('gulp-watch');


/**
 * Builds with jekyll
 */
gulp.task('jekyll-build', function(done) {
  var command = (process.platform === 'win32' ? 'jekyll.bat' : 'jekyll');

  return spawn(command, ['build'], {stdio: 'inherit'}).on('close', done);
});


/**
 * Rebuilds with jekyll
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  reload();
});


/**
 * Creates a server with livereload support
 */
gulp.task('server', function() {
  browser({
    server: {
      baseDir: './_site/'
    },
    port: 4000
  });
});


/**
 * Compiles and minifies stylus files to css
 */
gulp.task('stylus', function() {
  return gulp.src('src/styl/main.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true,
      use: [jeet(), kouto(), rupture()]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('assets/css/'));
});


/**
 * Concats and minifies javascript files 
 */
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('_site/assets/js/'))
    .pipe(reload({stream: true}))
    .pipe(gulp.dest('assets/js/'));
});


/**
 * Lints the javascript files
 */
gulp.task('jshint', function() {
  gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(watch('src/js/**/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


/**
 * Minifies and optimizes images for web
 */
gulp.task('imagemin', function() {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('_site/assets/img'))
    .pipe(gulp.dest('assets/img'));
});


/**
 * Watches the files for changes with gulp
 */
gulp.task('watch', function() {
  gulp.watch('src/styl/**/*.styl', ['stylus']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
  gulp.watch(['*.html','index.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});
  

/**
 * Creates the default gulp task
 */
gulp.task('default', ['stylus', 'scripts', 'imagemin', 'jekyll-build', 'server', 'watch']);