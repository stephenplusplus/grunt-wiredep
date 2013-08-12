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


/**
 * Try to use a `.bowerrc` file to find a custom directory. If it doesn't exist,
 * we're going with "bower_components".
 *
 * @ return {string} the path to the bower component directory
 */
var findBowerDirectory = function () {
  var directory = 'bower_components';

  if (grunt.file.isFile('.bowerrc')) {
    directory = grunt.file.readJSON('.bowerrc').directory || 'bower_components';
  }

  return directory;
};


module.exports = function (grunt) {
  grunt.registerMultiTask('bower-install', 'Inject all components in your HTML file.', function () {

    this.requiresConfig(['bower-install', this.target, 'html']);

    wiredep({
      directory: findBowerDirectory(),
      bowerJson: findBowerJSON(),
      ignorePath: this.data.ignorePath,
      htmlFile: this.data.html
    });
  });
};
