var _ = require('lodash');
var Q = require('q');
var helpers = require('./helpers');

var Admin = helpers.createClass({
	initialize: function (admin) {
		this._admin = admin;
	}
});

_.extend(Admin.prototype, {
	addUser: function (username, password, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		var deferred = Q.defer();
		_admin.addUser(username, password, options, resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	removeUser: function (username, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		var deferred = Q.defer();
		_admin.removeUser(username, options, resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	authenticate: function (username, password) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.authenticate(username, password, resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	replSetGetStatus: function () {
		var self = this;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		self._admin.replSetGetStatus(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	validateCollection: function (collectionName, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		var deferred = Q.defer();
		_admin.validateCollection(collectionName, options, resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	serverInfo: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.serverInfo(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	serverStatus: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.serverStatus(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	setProfilingLevel: function (level) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.setProfilingLevel(level, resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	profilingLevel: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.profilingLevel(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	profilingInfo: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.profilingInfo(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	ping: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
			_admin.ping(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	logout: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.logout(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	listDatabases: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.listDatabases(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	command: function (command, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		var deferred = Q.defer();
		_admin.command(command, options, resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	buildInfo: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		var deferred = Q.defer();
		_admin.buildInfo(resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	}
});

module.exports = Admin;