/*
 * bower-command.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var bower = require('bower').commands;

var BI;


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
    BI.get('done')();
    BI.get('grunt').task.run('bower-install:--silent');
  }
};


/**
 * Executes a Bower command using the Bower api.
 *
 * @param  {object} BowerInstall  the global configuration object
 * @param  {object} options       properties and methods to control the
 *                                execution of bower
 * @return {undefined}
 */
module.exports.execute = function (BowerInstall, options) {
  BI = BowerInstall;

  var bowerExec = bower[options.command];

  bowerExec(options.components, options.options || defaults.options)
    .on('data', options.data || defaults.data)
    .on('end', options.end || defaults.end);
};
