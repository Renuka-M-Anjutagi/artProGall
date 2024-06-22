var _ = require('lodash');
var Q = require('q');
var MongoNative = require('../../');
var randomstring = require('randomstring');

describe('db', function () {
	it('should add a user to the database', function (done) {
		db.addUser('user', 'name').then(function () {
	  	return db.removeUser('user');
	  }).then(function(result) {
	  	assert.ok(result)
	  	done()
	  }, function (err) {
	  	done(err)
	  });
	})

	it('should creates a collection on a server pre-allocating space, need to create f.ex capped collections', function (done) {
		db.createCollection("a_simple_collection", {
			capped:true,
			size:10000,
			max:1000,
			w:1
		}).then(function(collection) {
	    // Insert a document in the capped collection
	    return collection.insertOne({a:1}, {w:1});
	  }).then(function(result) {
    	assert.ok(result.a)
    	done()
    }, function (err) {
    	done(err)
    });
	})

	it('should drop a collection from the database, removing it permanently', function (done) {
		db.command({ping:1}).then(function(result) {
	    // Create a capped collection with a maximum of 1000 documents
	    return db.createCollection("a_simple_create_drop_collection", {capped:true, size:10000, max:1000, w:1});
	  }).then(function(collection) {
      // Insert a document in the capped collection
      return collection.insertOne({a:1}, {w:1});
    }).then(function(result) {
      // Drop the collection from this world
      return db.dropCollection("a_simple_create_drop_collection");
    }).then(function(result) {
      // Verify that the collection is gone
      return db.listCollections({name:"a_simple_create_drop_collection"});
    }).then(function(names) {
      assert.equal(0, names.length);
      done()
    }, function (err) {
    	done(err);
    });
	})

	it('should get the list of all collection information for the specified db', function (done) {
		// Get an empty db
	  var db1 = db.db('listCollectionTestDb');
	  // Create a collection
	  var collection = db1.collection('shouldCorrectlyRetrievelistCollections');
	  // Ensure the collection was created
	  db1.listCollections().then(function(collections) {
	  	return Q.all(collections.filter(function (collection) {
	  		return collection.name.indexOf('system.') === -1;
	  	}).map(function (collection) {
	  		return db1.collection(collection.name).drop();
	  	}));
	  }).then(function () {
	    // Return the information of a single collection name
	    return db1.listCollections();
	  }).then(function(items) {
      assert.equal(1, items.length);

    	return collection.insertOne({a:1}, {w:1})
    }).then(function () {
      return db1.listCollections();
    }).then(function (items) {
      assert.equal(2, items.length);
      done()
    }, function (err) {
    	done(err)
    });
	});

	it('should get all the db statistics', function (done) {
		db.stats().then(function (stats) {
			assert.ok(stats !== null);
			done();
		}, function (err) {
			done(err);
		});
	})

	it('should rename a collection', function (done) {
		var collection = db.collection('rename_collection_test');

		collection.insertMany([{a:1},{b:2},{c:3}]).then(function () {
			return db.listCollections();
		}).then(function (collections) {
			return Q.all(_.filter(collections, function (collection) {
				return (collection.collectionName === 'rename_collection_test' || collection.collectionName === 'rename_collection_test_renamed');
			}).map(function (collection) {
				return db.collection(collection.collectionName).drop();
			}));
		}).then(function () {
			return collection.insertMany([{a:1},{b: 1},{c: 3}], {w:1});
		}).then(function () {
			return db.renameCollection(collection.collectionName, 'rename_collection_test_renamed', { dropTarget: true });
		}).then(function (collection) {
			assert.equal('rename_collection_test_renamed', collection.collectionName);
			done();
		}, function (err) {
			done(err)
		});
	})

	it('should emit native events', function (done) {
		var called;
		MongoNative.connect('mongodb://localhost/dbtest').then(function (db) {
			called = false;
			db.on('close', function (e) {
				called = true;
			});

			return db.close();
		}).then(function () {
			assert.ok(called);
			done();
		}, function (err) {
			done(err);
		});
	})

	it('should authenticate a user against the server', function (done) {
		var username = randomstring.generate(7);
		db.addUser(username, 'name').then(function(result) {
	    // Authenticate
	    return db.authenticate(username, 'name');
	  }).then(function(result) {
			assert.equal(true, result);

			// Remove the user from the db
			return db.removeUser(username);
		}).then(function(result) {
			assert.ok(result);
			done();
		}, function (err) {
			done(err);
		});
	})

	it('should have database name', function () {
		assert.equal('testdb', db.databaseName)
	})

	it('should logout user from server, fire off on all connections and remove all auth info', function () {
		db.addUser('user3', 'name').then(function(result) {
	    assert.ok(result);

	    // Authenticate
	    return db.authenticate('user3', 'name');
	  }).then(function(result) {
      assert.equal(true, result);

      // Logout the db
      return db.logout();
    }).then(function(result) {
      assert.equal(true, result);

      // Remove the user
      return db.removeUser('user3');
    }).then(function(result) {
      assert.equal(true, result);
      done();
    });
	})

	it('should open the database', function (done) {
		db.open().then(function (d) {
			done();
		}, function (err) {
			done(err);
		});
	})

	it('should fetch a specific collection (containing the actual collection information)', function (done) {
		db.collection('should_open_database', function (err, collection) {
			assert.equal(null, err)
			assert.ok(collection instanceof MongoNative.Collection);
			done();
		}, function (err) {
			done(err);
		});
	})
})