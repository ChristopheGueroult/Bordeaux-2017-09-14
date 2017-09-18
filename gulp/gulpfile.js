'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');

var uglify = require('gulp-uglify');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');

// using gulp-minify instead of uglify
// var minify = require('gulp-minify');

// using minifier instead of uglify
// var minify = require('gulp-minifier');


// pour le dev =============================================================

gulp.task('sass', function(){
	return gulp.src('src/scss/global.scss')
	.pipe(sass())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('watch', ['browserSync','sass','concatJs'], function(){
	gulp.watch('src/scss/**/*.scss',['sass']);
	gulp.watch('src/javascript/**/*.js',['concatJs']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/javascript/**/*.js', browserSync.reload);
})

gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'src'
		}
	})
})

gulp.task('concatJs', function() {
  return gulp.src('src/javascript/*.js')
    .pipe(concat('production.js'))
    .pipe(gulp.dest('src/js'));
});


// pour la prod =============================================

// generate minify js in dist folder
// https://www.npmjs.com/package/gulp-uglify
gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/js/production.js'),
        uglify(),
        gulp.dest('dist/js/')
    ],
    cb
  );
});

// using minify instead uglify
// gulp.task('compress', function() {
// 	gulp.src('src/js/production.js').pipe(minify({
// 		ext: {
// 			// optionnel, crée un fichier de debug dans Dist
// 			src: '-debug.js',
// 			min: '-min.js'
// 		},
// 		exclude: ['tasks'],
// 		ignoreFiles: ['.combo.js', '-min.js']
// 	})).pipe(gulp.dest('dist/js'))
// });

// using gullp-minifier instead of uglify
// gulp.task('copyJS', function() {
//     return gulp.src('src/js/production.js')
//     .pipe(minify({
//         minify: true,
//         collapseWhitespace: true,
//         conservativeCollapse: true,
//         minifyJS: true
//           }))
//     .pipe(gulp.dest('dist/js/'));
// });

// generate minify css in dist folder
// https://www.npmjs.com/package/gulp-clean-css
gulp.task('minify-css', () => {
  return gulp.src('src/css/global.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'));
});

// copy all .html in dist folder
// https://coderwall.com/p/9uzttg/simple-gulp-copy-file-task
gulp.task('copy', function(){
	gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('browserSyncProd', function(){
	browserSync({
		server: {
			baseDir: 'dist'
		}
	})
})

// generate full dist
gulp.task('build',['compress','minify-css','copy', 'browserSyncProd'], function() {});


