var Q = require('q');
var _ = require('lodash');
var util = require('util');
var events = require('events');

function extend (protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent` constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
}

function DefaultClass () {
	if(_.isFunction(this.initialize)) {
    this.initialize.apply(this, arguments);
  }
}

DefaultClass.extend = extend;

util.inherits(DefaultClass, events);

_.extend(DefaultClass.prototype, {
  resultCallback: _.curry(function (resolve, reject, err, result) {
    if(err) {
      return reject(err);
    }

    resolve(result);
  })
});

function createClass (protoProps, staticProps) {
	return DefaultClass.extend(protoProps, staticProps);
}

function notImplemented (methodName) {
  return Q.reject(new Error('The method ' + methodName + ' is not implemented'));
}

var helpers = {
	extend: extend,
	createClass: createClass,
  notImplemented: notImplemented
};

module.exports = helpers;