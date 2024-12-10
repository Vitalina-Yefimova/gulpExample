// Подключаем модули
const gulp = require('gulp') //  Gulp — основной инструмент для выполнения задач
const sass = require('gulp-sass')(require('sass')) // Компиляция SASS в CSS
const cleanCSS = require('gulp-clean-css') // Минификация CSS
const terser = require('gulp-terser') // Минификация JavaScript
const concat = require('gulp-concat') // Конкатенация файлов
const browserSync = require('browser-sync').create() // Для запуска локального сервера и синхронизации с браузером

let autoprefixer // Для добавления вендорных префиксов

import('gulp-autoprefixer').then((module) => { // Используется import(), чтобы корректно работать с ESM (модулями ECMAScript)
    autoprefixer = module.default // После загрузки модуля, присваиваем значение переменной
}).catch((error) => {
    console.error('Ошибка загрузки модуля gulp-autoprefixer:', error)
})

// Пути к исходным файлам
const paths = {
    styles: {
        src: 'src/scss/**/*.scss', // Исходные файлы SASS
        dest: 'docs/css/'          // Папка для скомпилированных CSS
    },
    scripts: {
        src: 'src/js/**/*.js',     // Исходные JS-файлы
        dest: 'docs/js/'           // Папка для минифицированных JS
    },
    html: {
        src: 'src/*.html',         // Исходные HTML файлы
        dest: 'docs/'              // Папка для копируемых HTML
    }
}

// Компиляция и минификация SASS
function styles() {
    return gulp.src(paths.styles.src) // Берем все SASS файлы
        .pipe(sass().on('error', sass.logError)) // Компилируем SASS в CSS
        .pipe(cleanCSS()) // Минифицируем CSS
        .pipe(gulp.dest(paths.styles.dest)) // Сохраняем в папку назначения
        .pipe(browserSync.stream()) // Обновляем браузер при изменениях
}

// Минификация и объединение JS файлов
function scripts() {
    return gulp.src(paths.scripts.src) // Берем все JavaScript файлы
        .pipe(concat('main.js')) // Объединяем их в один файл main.js
        .pipe(terser()) // Минифицируем JS
        .pipe(gulp.dest(paths.scripts.dest)) // Сохраняем в папку назначения
        .pipe(browserSync.stream()) // Обновляем браузер при изменениях
}

// Копирование HTML файлов
function html() {
    return gulp.src(paths.html.src) // Берем все HTML файлы
        .pipe(gulp.dest(paths.html.dest)) // Копируем их в папку назначения
        .pipe(browserSync.stream()) // Обновляем браузер при изменениях
}

// Наблюдение за изменениями файлов
function watch() {
    browserSync.init({ // Инициализируем локальный сервер
        server: {
            baseDir: 'docs' // Базовая директория сервера
        }
    })
    gulp.watch(paths.styles.src, styles) // Следим за изменениями SASS файлов
    gulp.watch(paths.scripts.src, scripts) // Следим за изменениями JS файлов
    gulp.watch(paths.html.src, html) // Следим за изменениями HTML файлов
}

// Экспортируем функции для использования в Gulp
exports.styles = styles // Компиляция стилей
exports.scripts = scripts // Минификация скриптов
exports.html = html // Копирование HTML
exports.watch = watch // Наблюдение за файлами

// Стандартное задание по умолчанию
// Выполняет компиляцию, минификацию и запуск сервера
exports.default = gulp.series(
    gulp.parallel(styles, scripts, html), // Параллельно выполняем все задачи
    watch // После выполнения запускаем слежку за файлами
)