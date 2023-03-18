import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import { init, write } from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

const js = () =>
  src('idb.js')
    .pipe(plumber())
    .pipe(init())
    .pipe(
      babel({
        presets: ['@babel/env'],
        minified: true,
      }),
    )
    .pipe(write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist'));

export default js;