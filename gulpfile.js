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
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/'
	},
	app: { //исходники
		html: 'app/pages/*.html', // все файлы с расширением .html
		js: 'app/js/*.js',
		style: 'app/style/*.scss',
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
	// online: true,
	// tunnel: true,
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


gulp.task('js:build', function () {
	gulp.src(['./' + path.app.js, './bower/modernizr/modernizr.js']) //Найдем наш main файл
		.pipe(rigger()) //Прогоним через rigger
		// .pipe(sourcemaps.init()) //Инициализируем sourcemap
		.pipe(uglify()) //Сожмем наш js
		// .pipe(sourcemaps.write()) //Пропишем карты
		.pipe(gulp.dest('dist/js/')) //Выплюнем готовый файл в dist
		.pipe(reload({stream: true})); //И перезагрузим сервер
});


gulp.task('style:build', function () {
	gulp.src(path.app.style) //Выберем наш main.scss
		// .pipe(sourcemaps.init()) //То же самое что и с js
		.pipe(sass()) //Скомпилируем
		.pipe(prefixer()) //Добавим вендорные префиксы
		.pipe(cssmin()) //Сожмем
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.dist.css)) //И в dist
		.pipe(reload({stream: true}));
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

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build'
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