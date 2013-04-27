module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'bower-install': {
      index: 'index.html'
    }
  });

  grunt.loadNpmTasks('grunt-bower-install');

  grunt.registerTask('default', ['uglify']);
};
