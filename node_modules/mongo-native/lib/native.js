var _ = require('lodash');
var Q = require('q');

var helpers = require('./helpers');
var Db = require('./db');
var Collection = require('./collection');
var Admin = require('./admin');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var MongoNative = helpers.createClass({}, {
	Db: Db,
	Collection: Collection,
	Admin: Admin,
	connect: function (url, options) {
		var deferred = Q.defer();
		MongoClient.connect(url, options, function (err, db) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(new Db(db));
		});
		return deferred.promise;
	}
});

module.exports = MongoNative;