/*
 * grunt-bower-uninstall.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var bower = require('bower').commands;
var grunt = require('grunt');

module.exports.init = function (BI) {
  bower
    .uninstall([BI.get('component')], { save: true })
    .on('data', function () {
      grunt.log.writeln(arguments[0].toString());
    })
    .on('end', function () {
      require('./grunt-bower-install-all').init(BI);
    });
};
