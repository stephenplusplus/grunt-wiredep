module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower-install');

  grunt.initConfig({
    'bower-install': {
      html: 'index.html'
    }
  });
};
