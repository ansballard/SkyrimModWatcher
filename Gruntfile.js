module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      front: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          'public/javascripts/profile.min.js': ['src/javascripts/profile.js']
        }
      },
      back: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          'routes.min.js': ['src/root/routes.js'],
          'app.min.js': ['src/root/app.js'],
          'passport.min.js': ['src/root/passport.js']
        }
      },
      models: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          'models/admin.min.js': ['src/models/admin.js'],
          'models/modlist.min.js': ['src/models/modlist.js'],
          'models/blog.min.js': ['src/models/blog.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'public/stylesheets/profile.min.css': ['src/stylesheets/profile.css'],
          'public/stylesheets/home.min.css': ['src/stylesheets/home.css'],
          'public/stylesheets/users.min.css': ['src/stylesheets/users.css']
        }
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