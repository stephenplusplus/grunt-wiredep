/*
 * grunt-bower.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var wiredep = require('wiredep');


/**
 * Developers may still be using "component.json". That's fine, we can use that
 * just the same. But if they are, we'll let them know it's deprecated.
 *
 * @return {object} bower's .json configuration object
 */
var findBowerJSON = function () {
  var bowerJSON;

  grunt.util._.each(['bower.json', 'component.json'], function (configFile) {
    if (!bowerJSON && grunt.file.isFile(configFile)) {
      bowerJSON = grunt.file.readJSON(configFile);
    }
  });

  return bowerJSON;
};


module.exports = function (grunt) {
  grunt.registerTask('bower-install', 'Inject all components in your HTML file.', function () {
    this.requiresConfig(['bower-install', 'html']);

    wiredep({
      directory: grunt.file.readJSON('.bowerrc').directory || 'bower_components',
      bowerJson: findBowerJSON(),
      ignorePath: grunt.config.data['bower-install'].ignorePath,
      htmlFile: grunt.config.data['bower-install'].html
    });
  });
};
