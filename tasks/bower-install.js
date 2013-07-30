/*
 * grunt-bower.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var helpers = require('../lib/helpers');


/**
 * Developers may still be using "component.json". That's fine, we can use that
 * just the same. But if they are, we'll let them know it's deprecated.
 *
 * @param  {object} BI  the global configuration object
 * @return {object} bower's .json configuration object
 */
var findBowerJSON = function (BI) {
  var bowerJSON;

  grunt.util._.each(['bower.json', 'component.json'], function (configFile) {
    if (!helpers.is(bowerJSON, 'object') && grunt.file.isFile(configFile)) {
      bowerJSON = grunt.file.readJSON(configFile);

      if (configFile !== 'bower.json') {
        grunt.log.writeln();
        grunt.log.warn(configFile.yellow + ' is deprecated.'.yellow);
        grunt.log.writeln('Your dependencies are going to be managed in "bower.json" going forward. Everything will carry over. :)'.cyan);
        grunt.log.writeln();
      }
    }
  });

  return bowerJSON;
};


/**
 * Bootstraps the task by setting some config properties, and making sure we
 * have everything we need.
 *
 * @param  {object} task   the grunt task
 * @param  {object} grunt  the grunt object
 * @return {object} the data store used to set and retrieve configs
 */
var bootstrap = function (task, grunt) {
  var done = task.async();

  task.requiresConfig(['bower-install', 'html']);

  var store = helpers.createStore();
  store.set//some config properties.
    ('grunt', grunt)
    ('task', task)
    ('done', done)
    ('warnings', [])
    ('global-dependencies', helpers.createStore())
    ('.bowerrc', grunt.file.readJSON('.bowerrc'))
    ('bower.json', findBowerJSON(store))
    ('ignore-path', grunt.config.data['bower-install'].ignorePath)
    ('html-file', grunt.config.data['bower-install'].html)
    ('html', grunt.file.read(grunt.config.data['bower-install'].html))
    ('directory', store.get('.bowerrc').directory || 'bower_components')

  return store;
};

module.exports = function (grunt) {
  // bower-install task initialization.
  grunt.registerTask('bower-install', 'Inject all components in your HTML file.', function (component) {
    var BI = bootstrap(this, grunt);
    require('../lib/detect-dependencies').detect(BI);
    require('../lib/inject-dependencies').inject(BI);
  });
};
