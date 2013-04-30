/*
 * detect-dependencies.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var path = require('path');

var _ = require('./helpers')._;
var is = require('./helpers').is;
var isFile = require('./helpers').isFile;

var components;
var directory;
var globalDependencies;

var collectionOfWarnings = [];

var findComponentConfigFile = function (component) {
  var componentConfigFile;

  _.each(['bower.json', 'component.json', 'package.json'], function (configFile) {
    configFile = path.join(directory, component, configFile);

    if (!is(componentConfigFile, 'object') && isFile(configFile)) {
      componentConfigFile = grunt.file.readJSON(configFile);
    }
  });

  return componentConfigFile;
};

var gatherInfo = function (options) {
  return function (version, component) {
    var dep = globalDependencies.get(component) || {
      main: '',
      dependencies: {}
    };

    var componentConfigFile = findComponentConfigFile(component);

    if (is(dep.dependents, 'number')) {
      dep.dependents += 1;
    } else {
      dep.dependents = 1;
    }

    if (is(componentConfigFile.main, 'string')) {
      dep.main = path.join(directory, component, componentConfigFile.main);
    } else if (is(componentConfigFile.main, 'array')) {
      dep.main = path.join(directory, component, componentConfigFile.main[0]);
    } else {
      collectionOfWarnings.push(component + ' has no main file!');
      return;
    }

    if (options.nestedDependencies && componentConfigFile.dependencies) {
      var gatherInfoAgain = gatherInfo({ nestedDependencies: false });

      dep.dependencies = componentConfigFile.dependencies;

      _.each(componentConfigFile.dependencies, function (version, component) {
        gatherInfoAgain(version, component);
      });
    }

    globalDependencies.set(component, dep);
  }
};

var prioritizeDependencies = function () {
  var grouped = _.groupBy(globalDependencies.get(), 'dependents');
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

var refreshBI = function (BI) {
  directory = BI.get('directory');
  components = BI.get('bower.json').dependencies;
  globalDependencies = BI.get('global-dependencies');
};

module.exports.init = function (BI) {
  refreshBI(BI);

  _.each(components, gatherInfo({ nestedDependencies: true }));

  refreshBI(BI);

  BI.set('global-dependencies-sorted', prioritizeDependencies());

  return BI;
};
