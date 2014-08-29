'use strict';

function wiredep(grunt) {
  grunt.registerMultiTask('wiredep', 'Inject Bower components into your source code.', function () {
    this.requiresConfig(['wiredep', this.target, 'src']);
	// Extend the options object with the entire data object (instead of just .src) for backward compatibility.
    require('wiredep')(this.options(this.data));
  });
}

module.exports = wiredep;
