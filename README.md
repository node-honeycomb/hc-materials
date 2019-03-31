


### antd-tools改动

gulp.task('compile', gulp.parallel('compile-with-es', 'compile-with-lib'));

⇩

gulp.task('compile', gulp.parallel('compile-with-lib'));

增加tsConfig.rootDir，替换components
source.unshift(tsConfig.rootDir + '/**/*.js');