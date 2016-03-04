var gulp = require('gulp');
//Include our plugins
var browserSync = require('browser-sync');
var reload = browserSync.create();
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var del = require('del');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

//Used to refresh the browser on a change, not used right now
gulp.task('browserSync', function() {
  browserSync({
    server: {
          baseDir: './dist/'
        },
    port: 8000,
    files: [
      'dist/**/*.*'
    ]
  });
  gulp.watch("./dist", reload);
});

//Lint task (need to enter .js source)
gulp.task('lint', function() {
  return gulp.src('')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Compile our Sass into CSS (need to enter .scss source)
gulp.task('styles', function() {
  return gulp.src('./client/assets/styles/*.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./client/dist/styles/'));
});

//Concatenante and minify JS
gulp.task('scripts', function() {
  return gulp.src(['./client/**/*.js', '!./client/dist/**/*.js', '!./client/assets/libs/**/*.js'])
    .pipe(concat('./all.js'))
    .pipe(gulp.dest('./client/dist/'));
    // .pipe(rename('./all.min.js'))
    // .pipe(uglify())
    // .pipe(gulp.dest('./client/dist/'));
});

//Copys index.html file to dist folder
// gulp.task('copy-html', function() {
//   return gulp.src('./index.html')
//     .pipe(gulp.dest('./dist/'));
// });

//Clean the dist folder, not used right now
gulp.task('clean', function() {
  return del(['client/dist/']);
});

// start our node server using nodemon
gulp.task('serve', function() {
  nodemon({script: 'index.js', ignore: 'node_modules/**/*.js'});
});

//Runs these tasks everytime there is a change
gulp.task('watch', function() {
  gulp.watch('./client/**/*.js', ['lint', 'scripts']);
  gulp.watch('./client/**/*.scss', ['styles']);
  gulp.watch('index.html', ['copy-html']);
});

gulp.task('build', ['styles', 'scripts']);
gulp.task('default', ['lint', 'styles', 'scripts', 'watch', 'serve']);
