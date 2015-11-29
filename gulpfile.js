'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    dist: { //готовые после сборки файлы
        html: 'dist/',
        js: {
            myWork: 'dist/js/myWork/',
            index: 'dist/js/index/',
            feedback: 'dist/js/feedback/'
        },
        css: {
            index: 'dist/css/index/',
            myWork: 'dist/css/my-work/',
            feedback: 'dist/css/feedback/'
        },
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: { //исходники
        html: 'app/pages/*.html', // все файлы с расширением .html
        js: {
            index: 'app/js/pages/index/main.js',
            myWork: 'app/js/pages/my-work/main.js',
            feedback: 'app/js/pages/feedback/main.js'
        },
        style: {
            //Основные стили
            index: 'app/style/pages/index/main.scss',
            myWork: 'app/style/pages/my-work/main.scss',
            feedback: 'app/style/pages/feedback/main.scss',
            //Стили для планшетов
            indexTablet: 'app/style/pages/index/tablet.scss',
            myWorkTablet: 'app/style/pages/my-work/tablet.scss',
            feedbackTablet: 'app/style/pages/feedback/tablet.scss',
            //Стили для телефонов
            indexMobile: 'app/style/pages/index/mobile.scss',
            myWorkMobile: 'app/style/pages/my-work/mobile.scss',
            feedbackMobile: 'app/style/pages/feedback/mobile.scss'
        },
        img: 'app/img/**/*.+(png|jpg|jpeg|gif|svg)', //картинки всех расширений
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Пути для слежки
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/style/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    online: true,
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "burn"
};

gulp.task('html:build', function () {
    gulp.src(path.app.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку dist
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// Собираем скрипты
var buildingScripts = function(pathTo) {
  return gulp.src(pathTo.app) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(pathTo.dist)) //Выплюнем готовый файл в dist
        .pipe(reload({stream: true})); //И перезагрузим сервер
};

gulp.task('js:build', function () {
    buildingScripts({app: path.app.js.index, dist: path.dist.js.index});//Скрипты для домашней страницы
    buildingScripts({app: path.app.js.myWork, dist: path.dist.js.myWork});//Скрипты для страницы работ
    buildingScripts({app: path.app.js.feedback, dist: path.dist.js.feedback});//Скрипты для страницы обратной связи
});

// Собираем стили
var buildingStyles = function(pathTo) {
  return gulp.src(pathTo.app) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(pathTo.dist)) //И в dist
        .pipe(reload({stream: true}));
};

gulp.task('style:build', function () {
    // Основные стили
    buildingStyles({app: path.app.style.index, dist: path.dist.css.index}); // Стили для домашней страницы
    buildingStyles({app: path.app.style.myWork, dist: path.dist.css.myWork}); // Стили для страницы работ
    buildingStyles({app: path.app.style.feedback, dist: path.dist.css.feedback}); // Стили для страницы обратной связи

    // Стили для планшетов
    buildingStyles({app: path.app.style.indexTablet, dist: path.dist.css.index});
    buildingStyles({app: path.app.style.myWorkTablet, dist: path.dist.css.index});
    buildingStyles({app: path.app.style.feedbackTablet, dist: path.dist.css.index});

    //Стили для телефонов
    buildingStyles({app: path.app.style.indexMobile, dist: path.dist.css.index});
    buildingStyles({app: path.app.style.myWorkMobile, dist: path.dist.css.index});
    buildingStyles({app: path.app.style.feedbackMobile, dist: path.dist.css.index});

});

gulp.task('image:build', function () {
    gulp.src(path.app.img) 
        .pipe(imagemin({ //Сжатие картинок
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});


gulp.task('vendor:build', function() {
    gulp.src('bower/modernizr/modernizr.js')
        .pipe(gulp.dest('dist/js/vendor/'));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'vendor:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);