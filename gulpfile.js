var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    swig = require('gulp-swig'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    del = require('del');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dist/"
        },
        port: 4000
    });
});

gulp.task('templates', function() {

    return gulp.src(['./src/**/*.html', '!./src/_layouts/**/*', '!./src/_includes/**/*'])
            .pipe(swig({
                defaults: { cache: false },
                setup: function(swig) {
                    require('swig-highlight').apply(swig);
                }
            }))
            .pipe(gulp.dest('./dist'))
            .pipe(browserSync.reload({stream:true}));

});

gulp.task('styles', function() {

    return gulp.src('./src/static/scss/*')
            .pipe(sass())
            .pipe(autoprefixer('last 1 version', '> 1%', 'ie 8'))
            .pipe(gulp.dest('./dist/static/css'))
            .pipe(browserSync.reload({stream:true}));

});

gulp.task('scripts', function() {

    return gulp.src('./src/static/js/**/*')
            .pipe(gulp.dest('./dist/static/js/'))
            .pipe(browserSync.reload({stream:true}));

});

gulp.task('watch', function() {

    gulp.watch('./src/**/*.html', ['templates']);
    gulp.watch('./src/static/scss/*', ['styles']);
    gulp.watch('./src/static/js/**/*', ['scripts']);

});

gulp.task('clean', function(cb) {
    /* del(['./build', './mira-toggle.min.js'], cb); */
});

gulp.task('copy', function() {

    return gulp.src('./dist/**')
            .pipe(gulp.dest('./build'));

});

gulp.task('copy-fonts', function() {

    return gulp.src('./src/static/fonts/**')
        .pipe(gulp.dest('./dist/static/fonts'));

});

gulp.task('copy-media', function() {

    return gulp.src('./src/media/**')
        .pipe(gulp.dest('./dist/media'));

});

gulp.task('copy-img', function() {

    return gulp.src('./src/static/img/**')
        .pipe(gulp.dest('./dist/static/img'));

});


gulp.task('usemin', function() {

    return gulp.src('./build/index.html')
            .pipe(usemin({js: [uglify()]}))
            .pipe(gulp.dest('./build/'));

});

gulp.task('minify-css', function() {

    return gulp.src('./build/static/css/*.css')
            .pipe(minifyCSS())
            .pipe(gulp.dest('./build/static/css'));

});

gulp.task('copy-min-js', function() {

    /* return gulp.src('./build/static/js/mira-toggle.min.js')
            .pipe(gulp.dest('./')); */

});

gulp.task('clean-js-dirs', function(cb) {
    del(['./build/static/js/*/**', '!./build/static/js/*.js'], cb);
});

gulp.task('dev',['browser-sync', 'templates', 'styles', 'scripts', 'watch', 'copy-fonts','copy-media', 'copy-img']);

gulp.task('build', function() {
    runSequence('clean', 'copy', 'usemin', 'minify-css', 'copy-min-js', 'clean-js-dirs');
});