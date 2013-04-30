/*
 * grunt-bower-command.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var bower = require('bower').commands;

var BowerInstall;


var defaults = {
  options: {
    save: true
  },

  /**
   * Callback triggered when a line is ready to print to the screen.
   *
   * @return {undefined}
   */
  data: function () {
    grunt.log.write(arguments[0].toString());
  },

  /**
   * Callback used when the command has finished executing.
   *
   * @return {undefined}
   */
  end: function () {
    BowerInstall.get('done')();
    BowerInstall.get('grunt').task.run('bower-install:--silent');
  }
};


/**
 * Executes a Bower command using the Bower api.
 *
 * @param  {object} BI       the global configuration object
 * @param  {object} options  properties and methods to control the execution of
 *                           bower
 * @return {undefined}
 */
module.exports.execute = function (BI, options) {
  BowerInstall = BI;

  var bowerExec = bower[options.command];

  bowerExec(options.components, options.options || defaults.options)
    .on('data', options.data || defaults.data)
    .on('end', options.end || defaults.end);
};