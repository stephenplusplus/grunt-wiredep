/*
 * detect-dependencies.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var path = require('path');

var _ = grunt.util._;
var is = require('./helpers').is;
var isFile = grunt.file.isFile;


/**
 * Find the component's JSON configuration file.
 *
 * @param  {object} BI         the global configuration object
 * @param  {string} component  the name of the component to dig for
 * @return {object} the component's config file
 */
var findComponentConfigFile = function (BI, component) {
  var componentConfigFile;

  _.each(['bower.json', 'component.json', 'package.json'], function (configFile) {
    configFile = path.join(BI.get('directory'), component, configFile);

    if (!is(componentConfigFile, 'object') && isFile(configFile)) {
      componentConfigFile = grunt.file.readJSON(configFile);
    }
  });

  return componentConfigFile;
};

/**
 * Find the main script the component refers to. It's not always main :(
 *
 * @param  {object} BI            the global configuration object
 * @param  {string} component     the name of the component to dig for
 * @param  {componentConfigFile}  the component's config file
 * @return {string} the path to the component's primary script
 */
var findMainScript = function (BI, component, componentConfigFile) {
  var scriptPath;

  if (is(componentConfigFile.main, 'string')) {
    // start by looking for what every component should have: config.main
    scriptPath = componentConfigFile.main;
  } else if (is(componentConfigFile.main, 'array')) {
    // in case config.main is an array, grab the first one (grab all instead?)
    scriptPath = componentConfigFile.main[0];
  } else if (is(componentConfigFile.scripts, 'array')) {
    // still haven't found it. is it stored in config.scripts, then?
    scriptPath = componentConfigFile.scripts[0];
  }

  if (is(scriptPath, 'string')) {
    scriptPath = path.join(BI.get('directory'), component, scriptPath);
  }

  return scriptPath;
};


/**
 * Store the information our prioritizer will need to determine rank.
 *
 * @param  {object} BI       the global configuration object
 * @param  {object} options  optional parameters
 * @return {function} the iterator function, called on every component
 */
var gatherInfo = function (BI, options) {
  /**
   * The iterator function, which is called on each component.
   *
   * @param  {string} version    the version of the component
   * @param  {string} component  the name of the component
   * @return {undefined}
   */
  return function (version, component) {
    var dep = BI.get('global-dependencies').get(component) || {
      main: '',
      dependencies: {}
    };

    var componentConfigFile = findComponentConfigFile(BI, component);

    if (is(dep.dependents, 'number')) {
      dep.dependents += 1;
    } else {
      dep.dependents = 1;
    }

    dep.main = findMainScript(BI, component, componentConfigFile);

    if (!is(dep.main, 'string')) {
      // can't find the main file. this config file is useless!
      var warnings = BI.get('warnings');

      warnings.push(component + ' was not injected in your HTML.');
      warnings.push('Please go take a look in "' + path.join(BI.get('directory'), component) + '" for the file you need, then manually include it in your HTML file **outside** of the <!-- bower --> block.');

      BI.set('warnings', warnings);
      return;
    }

    if (options.nestedDependencies && componentConfigFile.dependencies) {
      var gatherInfoAgain = gatherInfo(BI, { nestedDependencies: false });

      dep.dependencies = componentConfigFile.dependencies;

      _.each(componentConfigFile.dependencies, function (version, component) {
        gatherInfoAgain(version, component);
      });
    }

    BI.get('global-dependencies').set(component, dep);
  }
};


/**
 * Sort the dependencies in the order we can best determine they're needed.
 *
 * @param  {object} BI  the global configuration object
 * @return {array} the sorted items of 'path/to/main/files.js'
 */
var prioritizeDependencies = function (BI) {
  var grouped = _.groupBy(BI.get('global-dependencies').get(), 'dependents');
  var sorted = [];

  _.each(grouped, function (dependencies, index) {
    _.chain(dependencies).groupBy(function (dependency) {
      return _.size(dependency.dependencies);
    }).toArray().value().reverse().forEach(function (dependency) {
      _.each(dependency, function (dependency) {
        sorted.push(dependency.main);
      });
    });
  });

  return sorted.reverse();
};


/**
 * Detect dependencies of the components from `bower.json`.
 *
 * @param  {object} BI the global configuration object.
 * @return {object} BI
 */
module.exports.detect = function (BI) {
  _.each(BI.get('bower.json').dependencies, gatherInfo(BI, { nestedDependencies: true }));

  BI.set('global-dependencies-sorted', prioritizeDependencies(BI));

  return BI;
};
