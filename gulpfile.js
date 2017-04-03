const gulp = require('gulp');
const clean = require('gulp-clean');
const filter = require('gulp-filter');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename')
const inject = require('gulp-inject');
const watch = require('gulp-watch');
const browserify = require('browserify')
const babelify = require('babelify')
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const debug = require('gulp-debug')

/* global configuration */
const srcDir = './app';
const destDir = './public';
const photonKitDistDir = './node_modules/photonkit/dist';

/* gulp task cleaning the build directory*/
gulp.task('clean', function () {
  return gulp.src([destDir], {read: false})
    .pipe(clean());
});

/* gulp task processing all css styles */
gulp.task('css', function() {
  return gulp.src([srcDir + '/**/*', photonKitDistDir + '/css/**/*!(min)*'], {base: './'})
  .pipe(filter('**/*.css'))
  .pipe(flatten())
    //.pipe(/* additional steps e.g. minify */)
  .pipe(gulp.dest(destDir + '/styles'))
});

/* gulp task processing all fonts styles */
gulp.task('fonts', function() {
  return gulp.src([srcDir + '/**/*', photonKitDistDir + '/fonts/**/*'], {base: './'})
  .pipe(filter(['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff']))
  .pipe(flatten())
    //.pipe(/* additional steps e.g. minify */)
  .pipe(gulp.dest(destDir + '/fonts'))
});

/* gulp task processing all html files which are not main index.html */
gulp.task('html', function() {
  return gulp.src(srcDir + '/**/*', {base: './'})
  .pipe(filter(['**/*.html', '!app/index.html']))
  .pipe(flatten())
  .pipe(gulp.dest(destDir + '/views'))
});

gulp.task('browserify', function () {
  var bundler = browserify('./app/app.js', { debug: true }).transform(babelify, {"presets": ["react", "electron"]});
  //bundle and
  bundler.bundle()
          .on('error', function (err) { console.error(err); })
          .pipe(source('app.js')) // vinyl-source-stream and vinyl-buffer convert this into something we can pipe to gulp
          .pipe(buffer())
          //.pipe(uglify()) // Use any gulp plugins you want now
          .pipe(rename('bundle.js'))
          .pipe(gulp.dest(destDir + '/js/'));
  })

/* gulp task processing all aditional JavaScript files */
gulp.task('js', ['browserify'], function() {

  var jsFiles = [srcDir + '/**/*'];

  return gulp.src(jsFiles)
    .pipe(flatten())
    .pipe(filter('**/*.js'))
    //.pipe(/* additional steps e.g. uglify */)
    .pipe(gulp.dest(destDir + '/js'));
});

/* gulp task creating icludes in the main html file*/
gulp.task('inject', ['browserify', 'html', 'css', 'fonts'], function() {

  var filesToinject = gulp.src(['/js/**/*', '/styles/**/*'].map(function (el) {return destDir + el;}), {read: false, })
    .pipe(filter(['**/*.js', '**/*.css']));
  var target = gulp.src(srcDir + '/index.html');

  return target.pipe(inject(filesToinject, {ignorePath: 'public', addRootSlash: false}))
    .pipe(gulp.dest(destDir));
});

/* gulp watcher running build process*/
gulp.task('watch',['inject'], function () {
    gulp.watch(['/**/*.js', '/**/*.html', '/**/*.css'].map(function (el) {return srcDir + el;}) , ['inject']);
});

/* wrapping gulp tasks for usage in run scripts */
gulp.task('build', ['inject']);
gulp.task('build-clean', ['clean']);