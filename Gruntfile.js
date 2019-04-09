module.exports = function(grunt) {
  // var target = grunt.option('target') || 'dev';
  grunt.initConfig({
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
    move: {
      main: {
        options: {
          ignoreMissing: true
        },
        files: [
        {
          src: 'node_modules/flatted/index.js',
          dest: 'modules/flatted/index.js'
        },
        {
          src: 'node_modules/node_generic_functions/genericfunctions.js',
          dest: 'modules/node_generic_functions/genericfunctions.js'
        },
        {
          src: 'node_modules/js-combinatorics/combinatorics.js',
          dest: 'modules/js-combinatorics/combinatorics.js'
        },
        {
          src: 'bower_components/basictable/jquery.basictable.min.js',
          dest: 'modules/basictable/jquery.basictable.min.js'
        },
        {
          src: 'bower_components/basictable/basictable.css',
          dest: 'modules/basictable/basictable.css'
        },
        {
          src: 'bower_components/fullcalendar/dist/fullcalendar.min.js',
          dest: 'modules/fullcalendar/fullcalendar.min.js'
        },
        {
          src: 'bower_components/fullcalendar/dist/fullcalendar.min.css',
          dest: 'modules/fullcalendar/fullcalendar.min.css'
        }
      ]
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
    },
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-move');
  var tasks = ['move','cssmin'];
  grunt.registerTask('default', tasks);
  grunt.registerTask('dev', ['default','watch']);
};