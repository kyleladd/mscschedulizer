module.exports = function(grunt) {

  // Project configuration.
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
          extDot: 'last'   // Extensions in filenames begin after the first dot
        },
        {
          expand: true,
          cwd: 'css',
          src: ['*.min.css'],
          dest: 'styles',
          ext: '.css',
          extDot: 'last'   // Extensions in filenames begin after the first dot
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
        files: 'www/asset/js/*',
        tasks: ['browserify','uglify'],
        options: {
          spawn:false,
          event:['all']
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', ['browserify','uglify','cssmin']);
  grunt.registerTask('dev', ['default','watch']);
};