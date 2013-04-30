/*
 * grunt-bower.js
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

  var createBucket = function () {
    var bucket = {};

    var set = function (property, value) {
      bucket[property] = value;
      return set;
    };

    var get = function (property) {
      if (!property) {
        return bucket;
      }

      return bucket[property];
    };

    return {
      set: set,
      get: get
    };
  };

  var bootstrap = function (task) {
    task.async();

    task.requiresConfig(['bower-install', 'html']);

    var BI = createBucket();

    BI
      .set//some config properties.
      ('global-dependencies', createBucket())
      ('.bowerrc', grunt.file.readJSON('.bowerrc'))
      ('bower.json', grunt.file.readJSON('bower.json'))
      ('html-file', grunt.config.data['bower-install'].html)
      ('html', grunt.file.read(grunt.config.data['bower-install'].html))
      ('directory', BI.get('.bowerrc').directory || 'bower_components')

    return BI;
  };

  grunt.registerTask('bower-install', 'Install and inject a component.', function (component) {
    var BI = bootstrap(this);

    if (component) {
      // asking for a specific component.
      BI.set('component', component);
      require('./grunt-bower-install').init(BI);
    } else {
      // install all of the components from bower.json.
      require('./grunt-bower-install-all').init(BI);
    }
  });

  grunt.registerTask('bower-uninstall', 'Uninstall a component.', function (component, force) {
    var BI = bootstrap(this);

    if (component) {
      BI.set('component', component);
      require('./grunt-bower-uninstall').init(BI);
    }
  });
};
