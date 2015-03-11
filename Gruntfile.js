module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      backend: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [
          {
            expand: true,
            cwd: 'src/root/',
            src: ['*.js'],
            dest: './',
            ext: '.min.js'
          }
        ]
      },
      models: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [
          {
            expand: true,
            cwd: 'src/models/',
            src: ['*.js'],
            dest: 'public/models/',
            ext: '.min.js'
          }
        ]
      },
      angular: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [
          {
            src: 'tmp/angular/users/app.concat.js',
            dest: 'public/angular/users/app.min.js'
          },
          {
            src: 'tmp/angular/profile/app.concat.js',
            dest: 'public/angular/profile/app.min.js',
          },
          {
            src: 'tmp/angular/home/app.concat.js',
            dest: 'public/angular/home/app.min.js'
          }
        ]
      }
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: 'src/stylesheets/',
            src: ['*.css'],
            dest: 'public/stylesheets/',
            ext: '.min.css'
          }
        ]
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: {
          'public/images/FNV_NEXUS_small.png': 'src/images/FNV_NEXUS_small.png',
          'public/images/congruent_outline.png': 'src/images/congruent_outline.png',
          'public/images/GitHub-Logo_invert.png': 'src/images/GitHub-Logo_invert.png',
          'public/images/ajax-loader.gif': 'src/images/ajax-loader.gif'
        }
      }
    },
    ngAnnotate: {
      options: {
        remove: true,
        add: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/angular/home/',
            src: ['*.js'],
            dest: 'tmp/angular/home/',
            ext: '.annotated.js'
          },
          {
            expand: true,
            cwd: 'src/angular/users/',
            src: ['*.js'],
            dest: 'tmp/angular/users/',
            ext: '.annotated.js'
          },
          {
            expand: true,
            cwd: 'src/angular/profile/',
            src: ['*.js'],
            dest: 'tmp/angular/profile/',
            ext: '.annotated.js'
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      dist: {
        files: [
          {
            src: ['tmp/angular/home/app.annotated.js','tmp/angular/home/*.annotated.js'],
            dest: 'tmp/angular/home/app.concat.js'
          },
          {
            src: ['tmp/angular/users/app.annotated.js','tmp/angular/users/*.annotated.js'],
            dest: 'tmp/angular/users/app.concat.js'
          },
          {
            src: ['tmp/angular/profile/app.annotated.js','tmp/angular/profile/*.annotated.js'],
            dest: 'tmp/angular/profile/app.concat.js'
          }
        ]
      }
    },
    clean: ['tmp'],
    watch: {
      css: {
        files: ['src/stylesheets/*.css'],
        tasks: ['cssmin']
      },
      backend: {
        files: ['src/root/*.js'],
        tasks: ['uglify:backend']
      },
      models: {
        files: ['src/models/*.js'],
        tasks: ['uglify:models']
      },
      angular: {
        files: ['src/angular/**/*.js'],
        tasks: ['ngAnnotate','concat','uglify:angular','clean']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['ngAnnotate','concat','uglify:angular','clean','uglify:backend','uglify:models','cssmin']);
  grunt.registerTask('angularMin', ['ngAnnotate','concat','uglify:angular'])
};
