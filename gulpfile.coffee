gulp    = require 'gulp'
coffee  = require 'gulp-coffee'

paths =
  src  : 'src/**/*.coffee'
  dest : 'lib'

gulp.task 'compile', ->
  gulp.src paths.src
    .pipe coffee bare: yes
    .pipe gulp.dest paths.dest

  gulp.src 'example/coffee/**/*.coffee'
    .pipe coffee bare: yes
    .pipe gulp.dest 'example'

gulp.task 'watch', ->
  gulp.watch paths.src, ['compile']

gulp.task 'default', ['compile', 'watch']
