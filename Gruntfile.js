module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
     options: {
       banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
     },
     build: {
       src: 'asset/js/schedulizer_bundle.js',
       dest: 'asset/js/schedulizer_bundle.min.js'
     }
   },
    browserify: {
      dist: {
        files: {
          'asset/js/schedulizer_bundle.js': ['asset/js/bundleme.js']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*css','!*.min.css'],
          dest: 'styles',
          ext: '.min.css',
          extDot: 'last'   // Extensions in filenames begin after the last dot
        },
        {
          expand: true,
          cwd: 'css',
          src: ['*.min.css'],
          dest: 'styles',
          ext: '.css',
          extDot: 'last'   // Extensions in filenames begin after the last dot
        }]
      }
    },
    watch: {
      css: {
        files: 'css/*',
        tasks: ['cssmin'],
        options: {
          spawn:false,
          event:['all']
        },
      },
      scripts: {
        files: ['asset/js/**/*.js'],
        tasks: ['default'],
        options: {
          spawn:false,
          event:['all']
        },
      },
    },
    copy: {
      main: {
        expand: true, src: ['asset/js/config.example.js'], dest: '',
        // Copy if file does not exist.
        filter: function (filepath) {
            // Return false if the file exists.
            return !(grunt.file.exists(filepath.replace('.example','')));
        },
        rename: function(dest, src) {
          return dest + src.replace('.example','');
        }
      }
    },
  dirs: {
    src: 'asset/js/models',
    dest: 'asset/js/dist',
  },
  concat: {
    basic: {
      src: ['<%= dirs.src %>/main.js','<%= dirs.src %>/../config.js','<%= dirs.src %>/selection.js','<%= dirs.src %>/item.js','<%= dirs.src %>/course.js','<%= dirs.src %>/courseTerm.js','<%= dirs.src %>/department.js','<%= dirs.src %>/generate.js','<%= dirs.src %>/helpers.js','<%= dirs.src %>/meeting.js','<%= dirs.src %>/schedule.js','<%= dirs.src %>/section.js','<%= dirs.src %>/semester.js','<%= dirs.src %>/storage.js','<%= dirs.src %>/filter.js','<%= dirs.src %>/export.js'],
      dest: '<%= dirs.dest %>/models.js',
    },
  }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', ['copy','concat','browserify','uglify','cssmin']);
  grunt.registerTask('dev', ['default','watch']);
};
