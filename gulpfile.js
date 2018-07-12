"use strict";

/* ==========================================================================
  Variables
  ========================================================================== */

var // Common
  gulp         = require("gulp"),
  gulpSequence = require("gulp-sequence"),
  plumber      = require("gulp-plumber"),
  notify       = require("gulp-notify"),
  del          = require("del"),
  rename       = require("gulp-rename"),
  replace      = require("gulp-replace"),
  concat       = require("gulp-concat"),
  flatten      = require("gulp-flatten"),
  changed      = require("gulp-changed"),
  watch        = require("gulp-watch"),
  browserSync  = require("browser-sync"),
  // HTML
  pug            = require("gulp-pug"),
  pugIncludeGlob = require("pug-include-glob"),
  useref         = require("gulp-useref"),
  htmlbeautify   = require("gulp-html-beautify"),
  htmlmin        = require("gulp-htmlmin"),
  w3cjs          = require("gulp-w3cjs"),
  // Styles
  sass         = require("gulp-sass"),
  postcss      = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano      = require("cssnano"),
  mqpacker     = require("css-mqpacker"),
  sortCSSmq    = require("sort-css-media-queries"),
  uncss        = require("uncss").postcssPlugin,
  // Scripts
  uglify = require("gulp-uglify"),
  // Images
  cache                  = require("gulp-cache"),
  imagemin               = require("gulp-imagemin"),
  imageminSvgo           = require("imagemin-svgo"),
  imageminJpegRecompress = require("imagemin-jpeg-recompress");

/* ==========================================================================
   Paths and options
   ========================================================================== */

var paths = {
  plugins: {
    css: [
      "node_modules/normalize.css/normalize.css"
    ]
  }
};

/* ==========================================================================
   Clean
   ========================================================================== */

gulp.task("clean:tmp", function() {
  console.log("----- Cleaning .tmp folder -----");
  del.sync(".tmp/**");
});

gulp.task("clean:dist", function() {
  console.log("----- Cleaning dist folder -----");
  del.sync("dist/**");
});

gulp.task("clean:cache", function() {
  console.log("----- Cleaning cache -----");
  return cache.clearAll();
});

gulp.task("clean", function(cb) {
  gulpSequence(["clean:tmp", "clean:dist", "clean:cache"])(cb);
});

/* ==========================================================================
   HTML
   ========================================================================== */

gulp.task("html:prebuild", function() {
  return gulp
    .src("src/*.pug")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(pug({
      basedir: __dirname + "/src",
      plugins: [pugIncludeGlob()]
    }))
    .pipe(replace("../images/", "images/"))
    .pipe(htmlbeautify({ indent_size: 2 }))
    .pipe(rename(function (path) {
      if (path.basename == "prototype") {
        path.basename = "index";
      }
      return path;
    }))
    .pipe(gulp.dest(".tmp/"));
});

gulp.task("html:build", function() {
  return (
    gulp
      .src(".tmp/*.html")
      .pipe(
        plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
      )
      .pipe(useref())
      .pipe(gulp.dest("dist/"))
  );
});

// htmlmin won't work together with useref at this time!
gulp.task("html:minify", ["html:build"], function() {
  return gulp
    .src("dist/*.html")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("html:validate", function() {
  return gulp
    .src("dist/[^google]*.html")
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
});

/* ==========================================================================
   Styles
   ========================================================================== */

gulp.task("styles:plugins", function() {
  return gulp
    .src(paths.plugins.css)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(changed(".tmp/css/"))
    .pipe(gulp.dest(".tmp/css/"));
});

gulp.task("styles:main", function() {
  return gulp
    .src([
      "src/scss/**",
      "src/blocks/**/*.scss"
    ])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(flatten())
    .pipe(concat("main.scss"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      postcss([
        autoprefixer(),
        mqpacker({
          sort: sortCSSmq.desktopFirst
        })
      ])
    )
    .pipe(gulp.dest(".tmp/css/"));
});

gulp.task("styles:prebuild", function(cb) {
  gulpSequence([
    "styles:plugins",
    "styles:main"
  ])(cb);
});

gulp.task("styles:build", function() {
  return gulp
    .src("dist/css/*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      postcss([
        uncss({
          html: ["dist/[^google]*.html"],
          ignore: [/.*[is,has]-.*/],
          ignoreSheets: [/fonts.googleapis/]
        })
      ])
    )
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest("dist/css/"));
});

/* ==========================================================================
   Scripts
   ========================================================================== */

gulp.task("scripts:common", function() {
  return gulp
    .src("src/js/**/*.js")
    .pipe(changed(".tmp/js/"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:blocks", function() {
  return gulp
    .src("src/blocks/**/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:prebuild", function(cb) {
  gulpSequence(
    ["scripts:common", "scripts:blocks"]
  )(cb);
});

gulp.task("scripts:build", function() {
  return gulp
    .src("dist/js/*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"));
});

/* ==========================================================================
   Images
   ========================================================================== */

gulp.task("images:prebuild", function() {
  return gulp
    .src("src/images/**")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(flatten())
    .pipe(
      cache(
        imagemin([
          imagemin.optipng(),
          imageminJpegRecompress({
            target: 0.8
          }),
          imageminSvgo({
            plugins: [{ removeViewBox: false }]
          })
        ])
      )
    )
    .pipe(gulp.dest(".tmp/images/"));
});

gulp.task("images:build", function() {
  return gulp
    .src("**/!(icons.svg)*", { cwd: ".tmp/images/" })
    .pipe(gulp.dest("dist/images/"));
});

/* ==========================================================================
   Fonts
   ========================================================================== */

gulp.task("fonts:prebuild", function() {
  return gulp
    .src("src/fonts/**")
    .pipe(changed(".tmp/fonts/"))
    .pipe(gulp.dest(".tmp/fonts/"));
});

gulp.task("fonts:build", function() {
  return gulp.src("src/fonts/**").pipe(gulp.dest("dist/fonts/"));
});
  
/* ==========================================================================
   Watch
   ========================================================================== */

gulp.task("watch", function() {

  watch(
    [
      "src/blocks/**/*.pug",
      "src/layouts/**",
      "src/*.pug"
    ],
    { readDelay: 200 },
    function () {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [
      "src/blocks/**/*.scss", 
      "src/scss/**",
      "src/css/**", 
    ],
    { readDelay: 200 },
    function() {
      gulp.start("styles:prebuild");
    }
  );

  watch(
    [
      "src/images/!(_)*/**",
      "src/images/*.*"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("images:prebuild");
    }
  );

  watch(
    [
      "src/blocks/**/*.js", 
      "src/js/**/*.js"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("scripts:prebuild");
    }
  );

  watch("src/fonts/*", { readDelay: 200 }, function() {
    gulp.start("fonts:prebuild");
  });
});

/* ==========================================================================
   Start local server
   ========================================================================== */

gulp.task("connect:tmp", function() {
  browserSync.init({
    server: ".tmp/",
    notify: false,
    open: false,
    reloadDebounce: 500
  });
  browserSync.watch(".tmp/*.html").on("change", browserSync.reload);
  browserSync.watch(".tmp/css/*").on("change", browserSync.reload);
  browserSync.watch(".tmp/js/*").on("change", browserSync.reload);
  browserSync.watch(".tmp/fonts/*").on("change", browserSync.reload);
});

gulp.task("connect:dist", function() {
  browserSync.init({
    server: "dist/",
    notify: false,
    open: false
  });
});

/* ==========================================================================
   Serve
   ========================================================================== */

   gulp.task("serve", function(cb) {
    gulpSequence(["prebuild"], ["connect:tmp"], ["watch"])(cb);
  });
  
  gulp.task("default", ["serve"], function() {});

/* ==========================================================================
   Build
   ========================================================================== */

gulp.task("prebuild", function(cb) {
  gulpSequence(
    [
    "images:prebuild", "scripts:prebuild", "fonts:prebuild", "html:prebuild", "styles:prebuild"
    ]
  )(cb);
});

gulp.task("build", function(cb) {
  gulpSequence(
    ["clean"],
    ["prebuild"],
    ["html:minify"],
    ["styles:build", "scripts:build", "images:build", "fonts:build"],
    ["html:validate"]
  )(cb);
});
