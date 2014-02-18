module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower-install');

  grunt.initConfig({
    bowerInstall: {
      target: {
        src: [
          'index.html'
        ]
      }
    }
  });
};