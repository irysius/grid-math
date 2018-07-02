var gulp = require('gulp');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var sequence = require('run-sequence');
var typingsUtil = require('@irysius/typings-util');

// build: compiles the TypeScript in src/ and dumps the output in build/
gulp.task('build', (done) => {
    sequence('clean-build', 'compile', 'copy', 'clean-src', done);
});
gulp.task('compile', (done) => {
    exec('node-tsc -p ./src', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(); // continue even if there's errors.
    });
});
gulp.task('copy', () => {
    return gulp.src(['src/**/*.js']).pipe(gulp.dest('build'));
});
gulp.task('clean-build', () => {
    return gulp.src(['build/**/*.*']).pipe(clean());
});
gulp.task('clean-src', () => {
    return gulp.src(['src/**/*.js']).pipe(clean());
});

// declaration-build: compiles the TypeScript in src/, and generates typings appropriate for publishing.
gulp.task('declaration', (done) => {
    exec('node-tsc -p ./src -d', (err, stdout, stderr) => {
        done(); // continue even if there's errors.
    });
});
gulp.task('declaration-copy', () => {
    return gulp.src([
        'src/**/*.d.ts'
    ]).pipe(gulp.dest('types'));
});
gulp.task('declaration-commonjs', () => {
    return typingsUtil.commonjs('./types', '@irysius/grid-math', './commonjs');
});
gulp.task('declaration-amd', () => {
    return typingsUtil.amd('./types', '@irysius/grid-math', './tests/project.d.ts');
});
gulp.task('declaration-clean', () => {
    return gulp.src([
        '**/*.d.ts',
        '!node_modules/**/*.d.ts', // do not clean declarations in node_modules
        '!commonjs/**/*.d.ts', // do not clean commonjs declaration outputs
        '!tests/project.d.ts', // do not clean merged project declaration
    ]).pipe(clean());
});
gulp.task('declaration-clean-amd', () => {
    return gulp.src(['tests/project.d.ts']).pipe(clean());
});
gulp.task('declaration-clean-commonjs', () => {
    return gulp.src(['commonjs/**/*.d.ts']).pipe(clean());
});
gulp.task('declaration-move', () => {
    return gulp.src(['commonjs/**/*.*']).pipe(gulp.dest('./'));
});
gulp.task('declaration-local', (done) => {
    sequence('declaration', 'declaration-copy', 'declaration-amd', 'declaration-clean', 'declaration-clean-commonjs', done);
});
gulp.task('declaration-publish', (done) => {
    sequence('declaration', 'declaration-copy', 'declaration-commonjs', 'declaration-clean', 'declaration-move', 'declaration-clean-commonjs', 'declaration-clean-amd', done);
});

// Tests
gulp.task('compile-test', (done) => {
    exec('node-tsc -p ./tests', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(); // continue even if there's errors.
    });
});
gulp.task('setup-test', () => {
    // Call this to copy built files to local node_modules so tests can find the files based on node module resolution.
    return gulp.src([
        'build/**/*.*'
    ]).pipe(gulp.dest('./node_modules/@irysius/grid-math/'));
});


gulp.task('default', ['build', 'declaration-local']);
gulp.task('prepare', ['build', 'declaration-publish']);
gulp.task('postpublish', ['declaration-clean']);