import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';

const js = () =>
  src('src/index.js')
    .pipe(plumber())
    .pipe(
      babel({
        presets: ['@babel/env'],
        minified: true,
      }),
    )
    .pipe(dest('dist'));

export default js;
