var _ = require('lodash');
var Q = require('q');
var helpers = require('./helpers');

var Admin = require('./admin');
var Collection = require('./collection');

var Db = helpers.createClass({
	initialize: function (db) {
		if(!_.isUndefined(db)) {
			this.setDb(db);
		}

		// Copy some of db native events
		_.forEach([
			'close',
			'error',
			'timeout',
			'reconnect',
			'fullsetup',
			'parseError',
			'authenticated'
		], function (eventName) {
			var self = this;
			this._db.on(eventName, function () {
				var args = _.toArray(arguments);
				self.emit.apply(self, [eventName].concat(args));
			});
		}, this);

		_.forEach(['databaseName'], function (key) {
			Object.defineProperty(this, key, {
				get: function () {
					return this._db[key];
				}
			});
		}, this);
	},

	setDb: function (db) {
		this._db = db;
	},

	getDb: function () {
		return this._db;
	},

	collection: function (name, options, callback) {
		var _db = this._db;

		if(_.isFunction (options)) {
			callback = options;
			options = {};
		}

		var collection = _db.collection(name, options, function (err, collection) {
			if(_.isUndefined(callback)) {
				return;
			}

			var coll = new Collection(collection);

			callback(err, coll);
		});

		var coll = new Collection(collection);

		return coll;
	}
});

_.extend(Db.prototype, {
	close: function (force) {
		var deferred = Q.defer();
		this._db.close(force, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	indexInformation: function(name, options) {
		var deferred = Q.defer();

		if(_.isUndefined(options)) {
			options = {};
		}

		this._db.indexInformation(name, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	addUser: function (username, password, options) {
		var deferred = Q.defer();
		this._db.addUser(username, password, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	removeUser: function (username, options) {
		var deferred = Q.defer();
		this._db.removeUser(username, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	admin: function () {
		var admin = this._db.admin();

		return new Admin(admin);
	},

	createCollection: function (name, options) {
		var self = this;
		var deferred = Q.defer();
		this._db.createCollection(name, options, function (err, collection) {
			if(err) {
				return deferred.reject(err);
			}

			collection = new Collection(collection);

			deferred.resolve(collection);
		});
		return deferred.promise;
	},

	createIndex: function (name, fieldOrSpec, options) {
		var deferred = Q.defer();
		this._db.createIndex(name, fieldOrSpec, options, function (err, indexName) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(indexName);
		});
		return deferred.promise;
	},

	dropCollection: function (name) {
		var deferred = Q.defer();
		this._db.dropCollection(name, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	dropDatabase: function () {
		var deferred = Q.defer();
		this._db.dropDatabase(function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	command: function (command, options) {
		var deferred = Q.defer();
		
		if(_.isUndefined(options)) {
			options = {};
		}

		this._db.command(command, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result);
		});
		return deferred.promise;
	},

	listCollections: function (filter, options) {
		var deferred = Q.defer();
		this._db.listCollections(filter, options).toArray(function (err, items) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(items);
		});
		return deferred.promise;
	},

	db: function (dbName) {
		var db;

		db = this._db.db(dbName);
		db = new Db(db);

		return db;
	},

	stats: function () {
		var deferred = Q.defer();
		this._db.stats(function (err, stats) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(stats);
		});
		return deferred.promise;
	},

	renameCollection: function (fromCollection, toCollection, options) {
		var deferred = Q.defer();
		
		if(_.isUndefined(options)) {
			options = {};
		}

		this._db.renameCollection(fromCollection, toCollection, options, function (err, collection) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(collection);
		});
		return deferred.promise;
	},

	authenticate: function (username, password, options) {
		var deferred = Q.defer();
		this._db.authenticate(username, password, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	logout: function (err, result) {
		var deferred = Q.defer();
		this._db.logout(options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	open: function () {
		var deferred = Q.defer();
		this._db.open(function (err, db) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(new Db(db));
		});
		return deferred.promise;
	}
});

module.exports = Db;