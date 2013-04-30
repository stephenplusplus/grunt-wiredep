/*
 * grunt-bower.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var bowerCommand = require('./grunt-bower-command');
var helpers = require('./helpers');


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
    ('global-dependencies', helpers.createStore())
    ('.bowerrc', grunt.file.readJSON('.bowerrc'))
    ('bower.json', grunt.file.readJSON('bower.json'))
    ('ignore-path', grunt.config.data['bower-install'].ignorePath)
    ('html-file', grunt.config.data['bower-install'].html)
    ('html', grunt.file.read(grunt.config.data['bower-install'].html))
    ('directory', store.get('.bowerrc').directory || 'bower_components')
    ('warnings', [])

  return store;
};


/**
 * Install a specific component using bower.
 *
 * @param  {object} BI         the global configuration object
 * @param  {string} component  the name of the component we want from bower
 * @return {undefined}
 */
var installComponent = function (BI, component) {
  bowerCommand.execute(BI, {
    command: 'install',
    components: [ component ]
  });
};


/**
 * Install all components listed in bower.json.
 *
 * @param  {object} BI        the global configuration object
 * @param  {object} options   optional parameters to control the execution
 * @return {undefined}
 */
var installAllComponents = function (BI, options) {
  bowerCommand.execute(BI, {
    command: 'install',
    components: BI.get('bower.json').dependencies,

    data: function () {
      if (options && !options.silent) {
        grunt.log.write(arguments[0].toString());
      }
    },

    end: function () {
      BI = require('./detect-dependencies').detect(BI);
      BI = require('./inject-dependencies').inject(BI);

      if (BI.get('warnings').length > 0) {
        require('./helpers').warn(BI.get('warnings'));
      }

      BI.get('done')();
    }
  });
};


/**
 * Uninstall a specified component using bower.
 *
 * @param  {object} BI         the global configuration object
 * @param  {string} component  the name of the component we are removing
 * @param  {object} options    optional parameters to control the execution
 * @return {undefined}
 */
var uninstallComponent = function (BI, component, options) {
  bowerCommand.execute(BI, {
    command: 'uninstall',
    components: [ component ],
    options: options,

    data: function (message) {
      message = message.toString();

      if (!message.match(/--force/)) {
        // no conflicts. log as usual.
        grunt.log.write(message);
      } else {
        grunt.log.warn('Basically, if you remove ' + component + ' there\'ll be problems.');
      }
    }
  });
};


module.exports = function (grunt) {
  // bower-install task initialization.
  grunt.registerTask('bower-install', 'Install and inject a component.', function (component) {
    var BI = bootstrap(this, grunt);

    if (helpers.is(component, 'string') && component !== '--silent') {
      installComponent(BI, component);
    } else if (component === '--silent') {
      // silence the log, to hide the fetching of cached components.
      installAllComponents(BI, { silent: true });
    } else {
      installAllComponents(BI);
    }
  });

  // bower-uninstall task initialization.
  grunt.registerTask('bower-uninstall', 'Uninstall a component.', function (component, force) {
    var BI = bootstrap(this, grunt);

    if (!force) {
      uninstallComponent(BI, component);
    } else {
      uninstallComponent(BI, component, { save: true, force: true });
    }
  });
};
