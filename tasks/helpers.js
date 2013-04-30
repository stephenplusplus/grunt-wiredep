var grunt = require('grunt');
var path = require('path');

module.exports._ = grunt.util._;

module.exports.isFile = function (file) {
  return grunt.file.isFile(file);
};

module.exports.isDir = function (dir) {
  return grunt.file.isDir(dir);
};

module.exports.exists = function (file) {
  return grunt.file.exists(file);
};

module.exports.is = function (thing, type) {
  return grunt.util.kindOf(thing) === type;
};

module.exports.run = function () {

};

module.exports.runTask = function (task) {
  return grunt.task.run(task);
};

module.exports.join = function () {
  return path.join(arguments);
};

/**
 * Quick litle buddy that pads and throws some warnings when something goes :(
 *
 * @param {array} messages Messages to be displayed
 * @return {undefined}
 */
module.exports.warn = function (messages) {
  if (messages.length === 0) {
    return this.warn([
      'Hmm, we had some problems.\nMake sure to check out the GitHub page for help:\nhttp://github.com/stephenplusplus/grunt-bower-install'
    ]);
  }

  messages.forEach(function (message) {
    grunt.log.writeln();
    grunt.log.warn(message);
  });
};
