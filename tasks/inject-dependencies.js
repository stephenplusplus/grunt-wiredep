/*
 * inject-dependencies.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var bower = require('bower').commands;

var dependenciesToInject;

module.exports.init = function (BI) {
  dependenciesToInject = BI.get('global-dependencies-sorted');

  grunt.file.write(BI.get('html-file'), BI.get('html').replace(/((\s*|\t*)<!--\s*bower\s*-->)(\n|.)*(<!--\s*endbower\s*-->)/im, function (match, openTag, spacing, oldScripts, closeTag) {
    var html = [openTag];

    BI.get('global-dependencies-sorted').forEach(function (path) {
      html.push(spacing + '<script src="' + path + '"></script>');
    });

    html.push(spacing, closeTag);

    return html.join('');
  }));

  return BI;
};
