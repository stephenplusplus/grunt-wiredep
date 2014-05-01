'use strict';

var bowerConfig = require('bower-config');
var fs = require('fs');
var path = require('path');

function bowerInstall(grunt) {
  function _findBowerJSON(cwd) {
    var bowerJSON;
    var config = bowerConfig.read(cwd);

    ['bower.json', 'component.json'].map(function (configFile) {
      return path.join(config.cwd, configFile);
    }).forEach(function (configFile) {
      if (!bowerJSON && fs.lstatSync(configFile).isFile()) {
        bowerJSON = JSON.parse(fs.readFileSync(configFile));
      }
    });

    return bowerJSON;
  }


  function _findBowerDirectory(cwd) {
    var config = bowerConfig.read(cwd);
    var directory = path.join(config.cwd, config.directory);

    if (!directory || !fs.lstatSync(directory).isDirectory()) {
      console.log(
        'Cannot find where you keep your Bower packages.' +
        '\n' +
        '\nWe tried looking for a `.bowerrc` file, but couldn\'t find a custom' +
        '\n`directory` property defined. We then tried `bower_components`, but' +
        '\nit looks like that doesn\'t exist either. As a last resort, we tried' +
        '\nthe pre-1.0 `components` directory, but that also couldn\'t be found.' +
        '\n' +
        '\nUnfortunately, we can\'t proceed without knowing where the Bower' +
        '\npackages you have installed are.' +
        '\n'
      );

      grunt.fail.fatal('No Bower components found.');
    }

    return directory;
  }

  grunt.registerMultiTask('bowerInstall', 'Inject all components in your HTML file.', function () {
    this.requiresConfig(['bowerInstall', this.target, 'src']);

    var cwd = this.data.cwd || '.';
    var options = this.data;

    options.bowerJson = _findBowerJSON(cwd);
    options.directory = _findBowerDirectory(cwd);
    options.src = grunt.file.expand(options.src);

    require('wiredep')(options);
  });
}

module.exports = bowerInstall;
