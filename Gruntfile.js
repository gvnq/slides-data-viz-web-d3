/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

  var banner = [
    'Hey, I bet what you\'re looking for is over there:',
    '<%= pkg.homepage %>'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bannerJsCss: '/*!\n * ' + banner.join('\n * ') + '\n */\n',
    bannerHtml: '\n<!--\n\n  ' + banner.join('\n  ') + '\n\n-->\n',

    // CHECKING, VALIDATION, LINTING
    // -----------------------------

    // JSON
    jsonlint: {
      config: {
        src: ['*.json']
      },
      data: {
        src: ['src/**/*.json', '!src/bower_components/**/*.json']
      }
    },

    // JS
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      config: {
        src: ['*.js']
      },
      code: {
        src: ['src/**/*.js', '!src/bower_components/**/*.js']
      }
    },

    // CSS
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      code: {
        src: ['src/**/*.css', '!src/bower_components/**/*.css']
      }
    },

    // HTML
    validation: {
      options: {
        reset: true,
        path: '.grunt-html-validation-status.json',
        reportpath: '.grunt-html-validation-report.json'
      },
      code: {
        src: ['src/**/*.html', '!src/bower_components/**/*.html']
      }
    },

    // SERVE
    // -----

    // HTTP
    connect: {
      options: {
        keepalive: true
      },
      src: {
        options: {
          base: 'src'
        }
      },
      dist: {
        options: {
          base: 'dist'
        }
      }
    },

    // BUILD
    // -----

    clean: {
      dist: {
        src: ['dist']
      }
    },

    useminPrepare: {
      options: {
        dest: 'dist/fr/'
      },
      html: 'src/fr/index.html'
    },

    cssmin: {
      options: {
        banner: '<%= bannerJsCss %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= bannerJsCss %>',
        preserveComments: 'some'
      }
    },

    // Copy non-usemin files.
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            'examples/data/*',
            'bower_components/reveal.js/plugin/highlight/highlight.js',
            'index.html',
            'en/index.html',
            'fr/index.html',
            'favicon.ico',
            'img/*',
            'css/fonts/*'
          ]
        }]
      }
    },

    rev: {
      dist: {
        src: [
          'dist/js/{,*/}*.js',
          'dist/css/{,*/}*.css',
          'dist/img/*',
          'dist/css/fonts/*'
        ]
      }
    },

    usemin: {
      options: {
        dirs: ['dist']
      },
      html: ['dist/{,*/}*.html'],
      css: ['dist/css/{,*/}*.css']
    },

    htmlmin: {
      options: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['index.html', 'en/index.html', 'fr/index.html'],
          dest: 'dist'
        }]
      }
    },

    replace: {
      dist: {
        src: ['dist/en/index.html', 'dist/fr/index.html'],
        overwrite: true,
        replacements: [{
          from: '<!DOCTYPE html>',
          to: '<!DOCTYPE html><%= bannerHtml %>'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('check', ['jsonlint', 'jshint', 'csslint', 'validation']);

  grunt.registerTask('default', ['check', 'connect:src']);

  grunt.registerTask(
    'build', ['check',
      'clean', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'copy', 'rev', 'usemin', 'htmlmin', 'replace'
    ]);

  grunt.registerTask('dist', ['build', 'connect:dist']);

};