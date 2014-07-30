'use strict';

function wiredep(grunt) {
  grunt.registerMultiTask('wiredep', 'Inject Bower components into your source code.', function () {
    this.requiresConfig(['wiredep', this.target, 'src']);
    require('wiredep')(this.options({src:this.data.src}));
  });
}

module.exports = wiredep;
