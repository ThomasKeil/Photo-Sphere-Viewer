module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    scsslint: 'grunt-scss-lint'
  });

  grunt.util.linefeed = '\n';

  var files_in_order = [
    'src/js/PhotoSphereViewer.js',
    'src/js/PSVComponent.js',
    'src/js/PSVLoader.js',
    'src/js/PSVHUD.js',
    'src/js/PSVPanel.js',
    'src/js/PSVTooltip.js',
    'src/js/PSVNavBar.js',
    'src/js/PSVNavBarCaption.js',
    'src/js/PSVNavBarSpacer.js',
    'src/js/PSVNavBarButton.js',
    'src/js/PSVNavBarAutorotateButton.js',
    'src/js/PSVNavBarFullscreenButton.js',
    'src/js/PSVNavBarZoomButton.js',
    'src/js/PSVNavBarDownloadButton.js',
    'src/js/PSVNavBarMarkersButton.js',
    'src/js/PSVNavBarCustomButton.js',
    'src/js/PSVError.js',
    'src/js/PSVUtils.js'
  ];


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner:
      '/*!\n' +
      ' * Photo Sphere Viewer <%= pkg.version %>\n' +
      ' * Copyright (c) 2014-2015 Jérémy Heleine\n' +
      ' * Copyright (c) 2015-<%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel\n' +
      ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n' +
      ' */',

    concat: {
      js: {
        options: {
          stripBanners: false,
          separator: '\n\n',
          process: function(src, path) {
            if (path.match(/\.svg$/)) {
              var filename = path.split('/').pop();
              return 'PhotoSphereViewer.ICONS[\'' + filename + '\'] = \'' + src + '\';';
            }
            else {
              return src;
            }
          }
        },
        src: files_in_order.concat(['src/icons/*.svg']),
        dest: 'dist/photo-sphere-viewer.js'
      },
      css: {
        options: {
          banner: '<%= banner %>\n\n'
        },
        files: [{
          expand: true,
          src: 'dist/*.css',
          dest: ''
        }]
      }
    },

    wrap: {
      dist: {
        src: 'dist/photo-sphere-viewer.js',
        dest: '',
        options: {
          separator: '',
          wrapper: function() {
            var wrapper = grunt.file.read('src/js/.wrapper.js').replace(/\r\n/g, '\n').split(/@@js\n/);
            wrapper[0] = grunt.template.process('<%= banner %>\n\n') + wrapper[0];
            wrapper[1] = '\n' + wrapper[1];
            return wrapper;
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>\n\n'
      },
      dist: {
        src: 'dist/photo-sphere-viewer.js',
        dest: 'dist/photo-sphere-viewer.min.js'
      }
    },

    sass: {
      options: {
        sourcemap: 'none',
        style: 'expanded'
      },
      dist: {
        src: 'src/scss/photo-sphere-viewer.scss',
        dest: 'dist/photo-sphere-viewer.css'
      }
    },

    cssmin: {
      dist: {
        src: 'dist/photo-sphere-viewer.css',
        dest: 'dist/photo-sphere-viewer.min.css'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dist: {
        src: ['src/js/*.js']
      },
      grunt: {
        src: ['Gruntfile.js']
      }
    },

    jscs: {
      lib: {
        options: {
          config: '.jscsrc'
        },
        src: ['src/js/*.js']
      }
    },

    scsslint: {
      allFiles: ['src/scss/*.scss'],
      options: {
        colorizeOutput: true,
        config: '.scss-lint.yml'
      }
    },

    connect: {
      dev: {
        options: {
          port: 9000,
          livereload: true
        }
      }
    },

    watch: {
      src: {
        files: ['src/**'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      },
      example: {
        files: ['example/**'],
        tasks: [],
        options: {
          livereload: true
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:<%= connect.dev.options.port%>/example/index.htm'
      }
    }
  });

  grunt.registerTask('default', [
    'concat:js',
    'wrap',
    'uglify',
    'sass',
    'cssmin',
    'concat:css'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jscs',
    'scsslint'
  ]);

  grunt.registerTask('serve', [
    'default',
    'open',
    'connect',
    'watch'
  ]);
};
