'use strict';

import gulp from 'gulp';
import gulpPlugins from 'gulp-load-plugins';
import bsync from 'browser-sync';
import pkg from './package.json';

var plugins = gulpPlugins();
var banner = () => {
  let buildDate = new Date();
  let bannerTemplate = [
    '/*',
    '<%= pkg.name %> - <%= pkg.homepage %>',
    'Version: <%= pkg.version %>',
    'Author: <%= pkg.authors[0] %>',
    '*/',
    ''
  ].join('\n');

  return plugins.header(bannerTemplate, {
    pkg: pkg,
    now: buildDate
  });
};

const files = {
  test: [
    'test/**/*.spec.js'
  ],
  formBuilder: {
    js: [
      'src/js/util.js',
      // 'src/js/properties.js',
      'src/js/fields.js',
      'src/js/field.js',
      'src/js/controls.js',
      'src/js/kc-toggle.js',
      'src/js/to-xml.js',
      'src/js/form-builder.js',
      'src/js/jquery-form-builder.js'
    ],
    sass: ['src/sass/form-builder.scss']
  },
  formRender: {
    js: [
      'src/js/kc-toggle.js',
      'src/js/form-render.js'
    ],
    sass: ['src/sass/form-render.scss']
  },
  demoSass: [
    'demo/assets/sass/demo.scss'
  ]
};

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['lint', 'js']);
  gulp.watch('demo/index.html', bsync.reload);
  gulp.watch('src/sass/*.scss', ['css']);
  gulp.watch(files.demoSass, ['demoCss']);
});

gulp.task('css', function() {

  let sassFiles = [
    files.formBuilder.sass,
    files.formRender.sass
  ];

  return sassFiles.forEach(function(sassFile) {
    gulp.src(sassFile)
      .pipe(plugins.sass())
      .pipe(plugins.autoprefixer({
        cascade: true
      }))
      .pipe(plugins.base64())
      .pipe(plugins.cssmin())
      .pipe(banner())
      .pipe(gulp.dest('demo/assets'))
      .pipe(gulp.dest('dist/'))
      .pipe(bsync.reload({
        stream: true
      }));
  });
});

gulp.task('font', function() {
  return gulp.src(['src/fonts/fontello/css/fontello.css'])
    .pipe(plugins.base64())
    .pipe(plugins.concat('_font.scss'))
    .pipe(gulp.dest('src/sass/'));
});

gulp.task('demoCss', function() {
  return gulp.src(files.demoSass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer({
      cascade: true
    }))
    .pipe(plugins.cssmin())
    .pipe(banner())
    .pipe(gulp.dest('demo/assets'))
    .pipe(bsync.reload({
      stream: true
    }));
});

gulp.task('lint', function() {
  let js = files.formBuilder.js.concat(files.formRender.js);
  return gulp.src(js)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('js', function() {

  let jsFiles = new Map();
  jsFiles.set('formBuilder', files.formBuilder.js);
  jsFiles.set('formRender', files.formRender.js);

  return jsFiles.forEach(function(jsFileGlob, key) {
    let fileName = key.replace(/([A-Z])/g, function($1) {
      return '-' + $1.toLowerCase();
    });

    /**
     * Demo scripts
     */
    gulp.src(jsFileGlob)
      .pipe(plugins.babel())
      .pipe(plugins.concat(fileName + '.js'))
      .pipe(banner())
      .pipe(gulp.dest('demo/assets'));

    gulp.src(jsFileGlob)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel())
      .pipe(plugins.concat(fileName + '.min.js'))
      .pipe(plugins.uglify())
      .pipe(banner())
      .pipe(plugins.sourcemaps.write('/'))
      .pipe(gulp.dest('demo/assets'));

    return gulp.src(jsFileGlob)
      .pipe(plugins.plumber())
      .pipe(plugins.babel())
      .pipe(plugins.concat(fileName + '.js'))
      .pipe(banner())
      .pipe(gulp.dest('dist/'))
      .pipe(plugins.uglify())
      .pipe(banner())
      .pipe(plugins.concat(fileName + '.min.js'))
      .pipe(gulp.dest('dist/'))
      .pipe(bsync.reload({
        stream: true
      }));
  });
});

gulp.task('serve', function() {
  bsync.init({
    server: {
      baseDir: './demo'
    }
  });
});

var increment = (importance) => {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(plugins.bump({
      type: importance
    }))
    .pipe(gulp.dest('./'))
    .pipe(plugins.git.commit('bumps package version'))
    .pipe(plugins.filter('package.json'))
    .pipe(plugins.tagVersion());
};

gulp.task('patch', () => {
  return increment('patch');
});
gulp.task('feature', () => {
  return increment('minor');
});
gulp.task('release', () => {
  return increment('major');
});

// Deploy the demo
gulp.task('deploy', () => {
  var gitArgs = {
    args: 'subtree push --prefix demo origin gh-pages'
  };

  plugins.git.exec(gitArgs, function(err) {
    if (err) {
      console.error('There was an error deploying the Demo to gh-pages\n', err);
      throw err;
    } else {
      console.log('Demo was successfully deployed!\n');
    }
  });
});

gulp.task('default', ['js', 'css']);
gulp.task('demo', ['js', 'css', 'demoCss', 'watch', 'serve']);
