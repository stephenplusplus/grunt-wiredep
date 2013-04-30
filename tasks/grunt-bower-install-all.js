/*
 * grunt-bower-install-all.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var bower = require('bower').commands;

module.exports.init = function (BI, options) {
  var components = BI.get('bower.json').dependencies;

  bower
    .install(components, { save: true })
    .on('data', function () {
      if (options && !options.silent) {
        grunt.log.write(arguments[0].toString());
      }
    })
    .on('end', function () {
      BI = require('./detect-dependencies').init(BI);
      BI = require('./inject-dependencies').init(BI);
    });

  return BI;
};
