const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('build-ts', function () {
  return gulp.src(['src/bloc/modules/**/*.{ts,tsx}']) // все .ts и .tsx
    .pipe(concat('bundle.tsx'))               // итоговый файл (можно .ts или .tsx)
    .pipe(gulp.dest('builds/'));
});

gulp.task('default', gulp.series('build-ts'));