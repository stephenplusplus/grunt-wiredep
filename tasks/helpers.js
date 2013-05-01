var grunt = require('grunt');

/**
 * Matches a thing with a type
 *
 * @param  {*}      thing  the thing to check
 * @param  {string} type   the type to match against
 * @return {Boolean}
 */
module.exports.is = function (thing, type) {
  return grunt.util.kindOf(thing) === type;
};


/**
 * Returns a set/get style internal storage bucket.
 *
 * @return {object} the API to set and retrieve data
 */
module.exports.createStore = function () {
  var bucket = {};

  /**
   * Sets a property on the store, with the given value.
   *
   * @param  {string} property  an identifier for the data
   * @param  {*}      value     the value of the data being stored
   * @return {function} the set function itself to allow chaining
   */
  var set = function (property, value) {
    bucket[property] = value;
    return set;
  };

  /**
   * Returns the store item asked for, otherwise all of the items.
   *
   * @param  {string|undefined} property  the property being requested
   * @return {*} the store item that was matched
   */
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


/**
 * Quick litle buddy that pads and throws some warnings when something goes :(
 *
 * @param  {array} messages  an array of messages to be displayed
 * @return {undefined}
 */
module.exports.warn = function (messages) {
  if (!messages) {
    return grunt.fail.fatal([
      '\n\nHmm, we had some problems.\nMake sure to check out the GitHub page for help:\n' + 'http://github.com/stephenplusplus/grunt-bower-install'.cyan
    ]);
  }

  // to prevent duplicate messages, we'll store what we've already presented.
  var displayedMessages = {};

  messages.forEach(function (message, index) {
    if (displayedMessages[message]) {
      return;
    }

    displayedMessages[message] = true;

    if (index % 2 === 0) {
      // a heading.
      grunt.log.writeln();
      grunt.log.warn(message.yellow);
    } else {
      // the sub-text to the heading.
      grunt.log.writeln(message.cyan);
    }
  });
};
