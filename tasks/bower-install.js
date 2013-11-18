/*
 * grunt-bower.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var wiredep = require('wiredep');
var bowerConfig = require('bower-config');
var path = require('path');


/**
 * Developers may still be using "component.json". That's fine, we can use that
 * just the same. But if they are, we'll let them know it's deprecated.
 *
 * @return {object} bower's .json configuration object
 */
var findBowerJSON = function (cwd) {

  var bowerJSON;

  ['bower.json', 'component.json'].forEach(function (configFile) {
    if (cwd) {
      configFile = path.join(cwd, configFile);
    }
    if (!bowerJSON && grunt.file.isFile(configFile)) {
      bowerJSON = grunt.file.readJSON(configFile);
    }
  });

  return bowerJSON;
};


/**
 * Try to use a `.bowerrc` file to find a custom directory. If it doesn't exist,
 * we're going with the Bower config default -- "bower_components".
 * 
 * @see http://goo.gl/ptecGW
 *
 * @ return {string} the path to the bower component directory
 */
var findBowerDirectory = function (cwd) {

  var directory;

  // we want to pass `cwd` to bower-config so that it can properly find `.bowerrc`
  // relative to `cwd` and not the current dir in which the job runs
  var config = bowerConfig.read(cwd);

  // bower-config only returns the name of the directory so we must join paths
  directory = path.join(cwd, config.directory);

  if (!directory || !grunt.file.isDir(directory)) {
    console.log([
      'Cannot find where you keep your Bower packages.',
      '',
      'We tried looking for a `.bowerrc` file, but couldn\'t find a custom',
      '`directory` property defined. We then tried `bower_components`, but',
      'it looks like that doesn\'t exist either.',
      '',
      'Unfortunately, we can\'t proceed without knowing where the Bower',
      'packages you have installed are.',
      ''
    ].join('\n'));

    grunt.fail.fatal('No Bower components found.');
  }

  return directory;
};


module.exports = function (grunt) {

  grunt.registerMultiTask('bower-install', 'Inject all components in your HTML file.', function () {

    this.requiresConfig(['bower-install', this.target, 'html']);

    var options = this.options({
      cwd: '.'
    });
    // override global setting with task setting
    options.cwd = this.data.cwd || options.cwd;

    wiredep({
      cwd: options.cwd,
      directory: findBowerDirectory(options.cwd),
      bowerJson: findBowerJSON(options.cwd),
      ignorePath: this.data.ignorePath,
      htmlFile: this.data.html,
      cssPattern: this.data.cssPattern,
      jsPattern: this.data.jsPattern
    });
  });
};
