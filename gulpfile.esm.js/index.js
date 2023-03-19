import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

const js = () =>
  src('idb.js')
    .pipe(plumber())
    .pipe(
      babel({
        presets: ['@babel/env'],
        minified: true,
      }),
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist'));

export default js;
