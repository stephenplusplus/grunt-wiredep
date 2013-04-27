/*
 * grunt-bower-install
 * https://github.com/stephenplusplus/bower-install
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  var path = require('path');

  /**
   * Quick litle buddy that pads and throws some warnings when something goes :(
   *
   * @param {array} messages Messages to be displayed
   * @return {undefined}
   */
  var throwSomeWarnings = function (messages) {
    messages.forEach(function (message) {
      grunt.log.writeln();
      grunt.log.warn(message);
    });
  };


  /**
   * When .bowerrc doesn't exist, we'll try some other common locations.
   *
   * @return {string|undefined}
   */
  var findComponentDirectory = function () {
    var directory;

    ['bower_components', 'components', 'app/components'].forEach(function (dir) {
      if (grunt.util.kindOf(directory) !== 'string' && grunt.file.isDir(dir)) {
        directory = dir;
      }
    });

    return directory || throwSomeWarnings([
      'Sorry, we can\'t find where you keep your bower components.',
      'Try creating a `.bowerrc` file in the root of your project\'s directory, then try again.'
    ]);
  };


  /**
   * Finds the "main" files from each dependency.
   *
   * @return {array}
   */
  var stripDependencies = function (directory, dependencies) {
    var mains = [];

    grunt.util._.each(dependencies, function (version, dependency) {
      var dir = directory + '/' + dependency;

      if (grunt.file.isDir(dir)) {
        // cool, we have this component already!
        mains.push(findMains(dir, { dependencies: false }));
      } else {
        // let's try to bower install it. cause why not.
        grunt.task.run('bower-install:' + dependency);
      }
    });

    return mains;
  };


  /**
   * Finds the "main" files this component refers to, as well as its immediate
   * dependencies.
   *
   * @param {directory} string  Directory to look in
   * @param {object} options    Option hash
   * @return {array|undefined} Path to the main file
   */
  var findMains = function (directory, options) {
    var configFile;
    var mains = [];

    [ path.join(directory, 'bower.json'),
      path.join(directory, 'component.json'),
      path.join(directory, 'package.json') ].forEach(function (file) {
      if (grunt.util.kindOf(configFile) === 'object' || !grunt.file.exists(file)) {
        return;
      }

      // found the config file!
      var tempFile = grunt.file.readJSON(file);

      if (grunt.util.kindOf(tempFile.main) === 'string') {
        configFile = tempFile;
        configFile.main = tempFile.main;
      }

      if (grunt.util.kindOf(tempFile.main) === 'array') {
        configFile = tempFile;
        configFile.main = tempFile.main[0];
      }
    });

    if (grunt.util.kindOf(configFile) === 'object' && grunt.file.exists(path.join(directory, configFile.main))) {
      // found the "main" file!

      // should we dig for dependencies?
      if (options.dependencies) {
        mains.push(stripDependencies(directory, configFile.dependencies));
      }

      mains.push(path.join(directory, configFile.main));

      return grunt.util._.flatten(mains);
    } else if (!options.silent) {
      // couldn't find the main file :(
      return throwSomeWarnings([
        'Well, we were able to install this component, but we couldn\'t find the primary file for this component.',
        'Please go and look through ' + directory + ' for the file you wish to use, then manually include it in your HTML file.'
      ]);
    }
  };


  /**
   * Inserts a <script></script> with the component.
   *
   * @param {string} html         The HTML
   * @param {string} pathToInject Path to the main file
   * @return {string}
   */
  var insertScriptPath = function (html, pathToInject) {
    pathToInject = '<script src="' + pathToInject.replace(grunt.config.data['bower-install'].ignorePath, '') + '"></script>';

    if (html.indexOf(pathToInject) > -1) {
      // the script path already exists in the html file.
      return html;
    }

    var newIndex;

    html.replace(/<!--\s*endbower\s*-->/, function (match, position) {
      newIndex
        = html.substr(0, position)
        + pathToInject
        + (html.match(/(\s*|\t*)<!--\s*endbower\s*-->/)[1] || '')
        + html.substr(position);
    });

    // the script was injected! pass it back.
    return newIndex;
  };


  /**
   * Removes the <script></script> with the component.
   *
   * @param {string} html         The HTML
   * @param {string} pathToRemove Path to the main file
   * @return {string}
   */
  var removeScriptPath = function (html, pathToRemove) {
    if (grunt.config.data['bower-install'].ignorePath) {
      pathToRemove = pathToRemove.replace(grunt.config.data['bower-install'].ignorePath, '');
    }

    if (html.indexOf(pathToRemove) === -1) {
      // the script path isn't in the html file :-?
      return html;
    }

    html = html.replace(pathToRemove, 'xxx');

    var script;

    // TODO:
    // think of a better way to check if the path is a file or folder.
    if (pathToRemove.substr(-3) !== '.js') {
      // no specific file name to search for.
      script = new RegExp('<script src="xxx.*\\.js"><\/script>(\\s*|\\t*)', 'g');
    } else {
      // cool, this thing is a file, and its gotta go.
      script = new RegExp('<script src="xxx"><\/script>(\\s*|\\t*)');
    }

    // the script was removed! pass it back.
    return html.replace(script, '');
  };


  /**
   * Register a bower install callback.
   *
   * @param {object} config .directory, .htmlFile, other options
   * @return {function}
   */
  var installDependency = function (config) {
    return function (error, result, code) {
      var pathsToInject = findMains(config.directory, { dependencies: true });
      var newHtmlFile;

      if (grunt.util.kindOf(pathsToInject) === 'array') {
        newHtmlFile = pathsToInject.reduce(insertScriptPath, config.htmlFile);
      }

      if (grunt.util.kindOf(newHtmlFile) === 'string') {
        grunt.file.write(grunt.config.data['bower-install'].html, newHtmlFile);
      }

      config.done(!code);
    }
  };


  /**
   * Register a bower uninstall callback.
   *
   * @param {object} config directory, index, other config options
   * @return {function}
   */
  var uninstallDependency = function (config) {
    return function (error, result, code) {
      if (result.stdout.indexOf('conflict') > -1) {
        // the user is removing a component with a conflicting dependency req.
        throwSomeWarnings([result.stdout.substr(0, result.stdout.indexOf('\nbower'))]);

        require('prompt').get({
          name: 'remove',
          message: 'are you sure you wish to remove ' + config.dependency + '? (y/n)',
          default: 'n'
        }, function (error, result) {
          result = result.remove;

          if (result === 'n') {
            grunt.log.writeln(config.dependency + ' has not been uninstalled.');
          }

          if (result === 'y' || result === 'yes') {
            grunt.task.run('bower-install:uninstall:' + config.dependency + ':force');
          }

          config.done();
        });

        return;
      }

      // no conflicting dependency junk. let's just delete this bad boy and get
      // outta here.

      grunt.log.write(result.toString());

      var pathsToRemove = config.mains;
      var newHtmlFile;

      if (grunt.util.kindOf(pathsToRemove) === 'array') {
        newHtmlFile = pathsToRemove.reduce(removeScriptPath, config.htmlFile);
      }

      if (grunt.util.kindOf(newHtmlFile) === 'string') {
        grunt.file.write(grunt.config.data['bower-install'].html, newHtmlFile);
      }

      config.done(!code);
    }
  };


  grunt.registerTask('bower-install', 'Install a dependency.', function () {
    // if a path to an html file isn't configured, there's not much point to
    // this plugin. :(
    grunt.config.requires(['bower-install', 'html']);

    var uninstalling = arguments[0] === 'uninstall' && arguments[1];

    var config = {};
    config.done = this.async();
    config.dependency = uninstalling ? arguments[1] : arguments[0];

    if (grunt.file.exists('.bowerrc')) {
      config.directory = path.join(grunt.file.readJSON('.bowerrc').directory, config.dependency);
    } else {
      config.directory = path.join(findComponentDirectory(), config.dependency);
    }

    config.htmlFile = grunt.file.read(grunt.config.data['bower-install'].html);

    if ( !grunt.file.exists(grunt.config.data['bower-install'].html)
      || !config.dependency
      || !config.directory) {
      return throwSomeWarnings([
        'Hmm, we had some problems.\nMake sure to check out the GitHub page for help:\nhttp://github.com/stephenplusplus/grunt-bower-install'
      ]);
    }

    if (uninstalling && grunt.file.isDir(config.directory)) {
      config.mains = findMains(config.directory, { dependencies: false, silent: true });
    } else if (uninstalling) {
      config.mains = [config.directory];
    }

    var args = uninstalling ? ['uninstall'] : ['install'];

    args.push(config.dependency);
    args.push('--save');

    if (arguments[2] === 'force') {
      args.push('--force');
    }

    var bower = grunt.util.spawn({
      cmd: 'bower',
      args: args
    }, uninstalling? uninstallDependency(config) : installDependency(config));

    if (!uninstalling) {
      bower.stdout.pipe(process.stdout);
    }

    bower.stderr.pipe(process.stderr);
  });
};
