const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync').create();

console.log($);

// less编译，css压缩
gulp.task('less', () => {
    return gulp.src('./src/css/**/*.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({stream: true}))
    .on('end', () => {
        gulp.start('html')
    })
});

// js 压缩，es6支持
gulp.task('js', () => {
    return gulp.src('./src/js/**/*.js')
    .pipe($.babel({
        presets: ['env'],
        plugins: ['transform-runtime']
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({stream: true}))
    .on('end', () => {
        gulp.start('html')
    })
});

// html压缩，静态资源引入
gulp.task('html', () => {
    return gulp.src('./src/**/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe($.inlineSource({
        compress: true,
        rootpath: './'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({stream: true}))
});

// 图片压缩
gulp.task('image', function () {
    return gulp.src("src/images/**/*.{png,jpg,gif,jpeg,ico}")
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}))
});

// 清空生成目录
gulp.task('clean', (cb) => {
    return del(['dist'], cb);
});

gulp.task('server', () => {
    browserSync.init({
        port: 2333,
        open: false,
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('watch', () => {
    gulp.watch('./src/css/**/*.less', ['less']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/images/**/*.{png,jpg,gif,jpeg,ico}', ['image']);
    console.log('已开启文件监听~')
});

gulp.task('default', ['clean'], () => {
    gulp.start('less', 'js' ,'image', 'server', 'watch');
});