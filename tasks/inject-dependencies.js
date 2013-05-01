/*
 * inject-dependencies.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var bower = require('bower').commands;

var globalDependenciesSorted;
var ignorePath;

var block = /((\s*|\t*)<!--\s*bower\s*-->)(\n|.)*(<!--\s*endbower\s*-->)/i;


/**
 * Callback function after matching our regex from the HTML file.
 *
 * @param  {array}  match       strings that were matched
 * @param  {string} startBlock  the opening <!-- bower --> comment
 * @param  {string} spacing     the type and size of indentation
 * @param  {string} oldScripts  the old block of scripts we'll remove
 * @param  {string} endBlock    the closing <!-- endbower --> comment
 * @return {string} the new html
 */
var replace = function (match, startBlock, spacing, oldScripts, endBlock) {
  var html = startBlock;

  globalDependenciesSorted.forEach(function (path) {
    html += spacing + '<script src="' + path.replace(ignorePath, '') + '"></script>';
  });

  return html += spacing + endBlock;
};


/**
 * Injects dependencies into the specified HTML file.
 *
 * @param  {object} BI the global configuration object.
 * @return {object} BI
 */
module.exports.inject = function (BI) {
  globalDependenciesSorted = BI.get('global-dependencies-sorted');
  ignorePath = BI.get('ignore-path');

  // grab the html file and its contents, then drop our scripts in.
  grunt.file.write(BI.get('html-file'), BI.get('html').replace(block, replace));

  return BI;
};
