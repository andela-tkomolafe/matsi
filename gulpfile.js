var browserify = require('browserify'),
    concat = require('gulp-concat'),
    es6ify = require('es6ify'),
    gulp = require('gulp'),
    bower = require('gulp-bower'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    nodemon = require('gulp-nodemon'),
    path = require('path'),
    rev = require('gulp-rev'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    karma = require('gulp-karma'),
    exit = require('gulp-exit'),
    watchify = require('watchify'),
    mocha = require('gulp-mocha');

var paths = {
    public: 'public/**',
    jade: 'app/**/*.jade',
    scripts: 'app/**/*.js',
    img:['app/**/*.jpg',
        'app/**/*.png',
        'app/**/*.jpeg',
        'app/**/*.ico'],
    libTest: ['lib/tests/service.spec.js'],
    unitTest: [
      'public/lib/angular/angular.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/lib/moment/moment.js',
      'public/lib/firebase/firebase.js',
      'public/lib/angular-aria/angular-aria.js',
      'public/lib/angular-ui-router/release/angular-ui-router.min.js',
      'public/lib/hammerjs/hammer.min.js',
      'public/lib/angular-material/angular-material.js',
      'public/lib/angular-route/angular-route.js',
      'public/lib/angular-cookies/angular-cookies.js',
      'public/lib/angular-bootstrap/ui-bootstrap.js',
      'public/lib/angular-animate/angular-animate.js',
      'public/lib/angular-sanitize/angular-sanitize.js',
      'public/lib/angularfire/dist/angularfire.js',
      'public/lib/lodash/dist/lodash.min.js',
      'public/js/index.js',
      'app/test/specs.js'
    ],
    styles: 'app/styles/*.+(less|css)'
};

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('public/lib/'))
});

gulp.task('lint', function() {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});

gulp.task('jade', function() {
    gulp.src('./app/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./public/'))
});

gulp.task('less', function() {
    gulp.src(paths.styles)
        .pipe(less({
            paths: [path.join(__dirname, 'styles')]
        }))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('lint', function() {
    gulp.src(['index.js','./app/**/*.js']).pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//'app/**',
gulp.task('nodemon', function() {
    nodemon({
            script: 'index.js',
            ext: 'js',
            ignore: ['public/']
        })
        .on('change', ['lint'])
        .on('restart', function() {
            console.log('>> node restart');
        })
});


gulp.task('watch', function() {
    // livereload.listen({ port: 35729 });
    gulp.watch(paths.jade, ['jade']);
    gulp.watch(paths.styles, ['less']);
    // gulp.watch(paths.public).on('change', livereload.changed);
});

gulp.task('img', function() {
   return gulp.src(paths.img)
    .pipe(gulp.dest('public/'));
});

gulp.task('watchify', function() {
    var bundler = watchify(browserify('./app/application.js', watchify.args));

    bundler.transform(stringify(['.html']));
    // bundler.transform(es6ify);

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('index.js'))
            .pipe(gulp.dest('./public/js'));
    }

    return rebundle();
});

gulp.task('browserify', function() {
 var b = browserify();
 b.add('./app/application.js');
 return b.bundle()
 .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
 .on('error', gutil.log.bind(gutil, 'Browserify Error: in browserify gulp task'))
 .pipe(source('index.js'))
 .pipe(gulp.dest('./public/js'));
});
// gulp.task('usemin', function() {
//   gulp.src('public/*.html')
//     .pipe(usemin({
//       css: [minifyCss(), 'concat'],
//       html: [minifyHtml({empty: true})],
//       js: [uglify(), rev()]
//     }))
//     .pipe(gulp.dest('public'));
// });

gulp.task('test:lib', function() {
    return gulp.src(paths.libTest)
        .pipe(mocha({
            reporter: 'dot',
            timeout: 60000
        }));
});

gulp.task('test:ui',['browserify'], function() {
    // Be sure to return the stream
    return gulp.src(paths.unitTest)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
                // .on('error', function(err) {
        //     // Make sure failed tests cause gulp to exit non-zero
        //     throw err;
        // });
});

gulp.task('test',['test:ui','test:lib']);
gulp.task('heroku:production', ['bower', 'jade', 'less','img','browserify']);
gulp.task('production', ['nodemon','bower','jade', 'less','watchify','img']);
gulp.task('default', ['nodemon', 'jade', 'less', 'watch', 'watchify','img']);
gulp.task('build', ['jade', 'less', 'watchify','img']);
