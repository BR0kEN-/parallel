'use strict';

// Gulp.
import Gulp from './.gulp/Gulp';
// Assets plugins.
import Js from './.gulp/Js';
import Scss from './.gulp/Scss';

const gulp = new Gulp();
const filter = new Gulp('filter', file => file.path.split('/').pop().charAt(0) !== '_');

// A set of assets plugins with linters.
const assets = {
  js: new Js('./sources/js/**/*.js', './js'),
  scss: new Scss('./sources/scss/**/*.scss', './css'),
};

const taskNames = Object.keys(assets).map(taskName => {
  const asset = assets[taskName];

  gulp.task(taskName, () => {
    let task = gulp
      .src(asset.src)
      // Process sources.
      .pipe(asset.Invoke())
      // Do not stop watching on SCSS/JS compilation errors.
      .on('error', error => console.warn(error.message))
      // Allow copy files into destination only if their names starts from "_".
      .pipe(filter.Invoke());

    asset.taskPipes().forEach(pipe => task = task.pipe(pipe));

    // Copy processed sources into destination.
    task.pipe(gulp.dest(asset.dest));
  });

  // Lint should be dependent from original task.
  gulp.task(taskName + '-lint', [taskName], () => {
    const lint = gulp
      .src(asset.src)
      // Invoke validation tool.
      .pipe(asset.lint.Invoke());

    // Run additional validation pipes.
    asset.lintPipes().forEach(pipe => lint.pipe(pipe));
  });

  return taskName;
});

// Run linters.
gulp.task('lints', taskNames.map(taskName => taskName + '-lint'));

// Run all asset-related tasks.
gulp.task('compile', taskNames);

// Run web server and watch for CSS/JS updates.
gulp.task('default', ['compile'], () => {
  // Run related tasks when any of tracked files was changed.
  taskNames.forEach(taskName => gulp.watch(assets[taskName].src, [taskName]));
});
