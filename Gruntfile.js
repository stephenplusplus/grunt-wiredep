module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    bowerInstall: {
      app: {
        src: 'index.html'
      }
    }
  });
};
