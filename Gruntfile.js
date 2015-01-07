module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      front: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: [
          {
            expand: true,
            cwd: 'src/javascripts/',
            src: ['*.js'],
            dest: 'public/javascripts/',
            ext: '.min.js'
          }  
        ]
      },
      back: {
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
    watch: {
      javascript: {
        files: ['src/javascripts/*.js'],
        tasks: ['uglify:front']
      },
      css: {
        files: ['src/stylesheets/*.css'],
        tasks: ['cssmin']
      },
      backend: {
        files: ['src/root/*.js'],
        tasks: ['uglify:back']
      },
      models: {
        files: ['src/models/*.js'],
        tasks: ['uglify:models']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify','cssmin']);
};
