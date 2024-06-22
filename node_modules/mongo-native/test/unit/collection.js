var _ = require('lodash');

describe('collection', function () {
	var users = db.collection('users');
	
	it('should insert a document', function (done) {
		users.insert([
			{ name: 'my name' },
			{ name: 'another name' },
			{ name: 'more name' }
		]).then(function (users) {
			assert.equal(users.length, 3);
			done()
		}, function (err) {
			done(err)
		})
	})

	it('should drops an index from this collection', function () {
		users.deleteMany({}, {w:1}).then(function(result) {
	    // Create an index on the a field
	    return users.ensureIndex({a:1, b:1}, {unique:true, background:true, w:1});
	  }).then(function(indexName) {
      // Drop the index
      return users.dropIndex("a_1_b_1");
    }).then(function(result) {
      // Verify that the index is gone
      return users.indexInformation();
    }).then(function(indexInformation) {
      assert.deepEqual([ [ '_id', 1 ] ], indexInformation._id_);
      assert.equal(null, indexInformation.a_1_b_1);
      done()
    }, function (err) {
    	throw err;
    });
	})

	it('should creates a cursor for a query that can be used to iterate over results from MongoDB', function (done) {
		var collection = db.collection('simple_query');

	  // Clean the collection
	  collection.deleteMany({}, {w:1}).then(function () {
	  	// Insert a bunch of documents for the testing
			return collection.insertMany([{a:1}, {a:2}, {a:3}], {w:1});
		}).then(function () {
	    // Peform a simple find and return all the documents
	    return collection.find();
	  }).then(function(docs) {
      assert.equal(3, docs.length);
      done();
    }, function (err) {
    	done(err);
    });
	})

	it('should find a document', function (done) {
		var id;
		users.deleteMany({}, {w:1}).then(function () {
			return users.insertMany([{a:1}, {a:2}, {a:3}], {w:1});
		}).then(function () {
			return users.find();
		}).then(function (docs) {
			assert.ok(docs instanceof Array);
			assert.equal(3, docs.length)
			id = docs[0]._id;
			return users.findOne({ _id: id })
		}).then(function (user) {
			assert.ok(!(user instanceof Array));
			assert.equal(String(user._id), String(id))
			done()
		}, function (err) {
			done(err)
		});
	})

	it('should find and remove a document', function (done) {
		users.insertMany([{a:1}, {b:1, d:1}, {c:1}], {w:1}).then(function(result) {
	    // Simple findAndModify command returning the old document and
	    // removing it at the same time
	    return users.findAndRemove({b:1}, [['b', 1]]);
	  }).then(function(doc) {
      assert.equal(1, doc.value.b);
      assert.equal(1, doc.value.d);

      // Verify that the document is gone
      return users.findOne({b:1});
    }).then(function(item) {
      assert.equal(null, item);
      done()
    });
	})

	it('should update a collection', function (done) {
		users.insertOne({
			name: 'My new name',
			addresses: [{
				route: 'Address, 120'
			}]
		}).then(function (user) {
			assert.equal(user.name, 'My new name');
			assert.equal(user.addresses[0].route, 'Address, 120');

			return users.update({
				_id: user._id
			}, {
				$set: {
					name: 'Another name',
				},
				$push: {
					addresses: {
						route: 'Another route, 300'
					}
				}
			}).then(function (result) {
				assert.ok(result.ok);
				assert.equal(result.n, 1)

				return users.findOne({
					_id: user._id
				});
			});
		}).then(function (user) {
			assert.equal(user.name, 'Another name');
			assert.equal(user.addresses[0].route, 'Address, 120');
			assert.equal(user.addresses[1].route, 'Another route, 300');
			done()
		}, function (err) {
			done(err);
		});
	})

	it('should support the one callback method', function (done) {
		db.collection('testing_collection_cbs', function (err, coll) {
			assert.equal(null, err)
			assert.ok(coll instanceof MongoNative.Collection)
			done();
		});
	});

	it('should retrieves this collections index info', function (done) {
		var collection = db.collection('more_index_information_test_2');
	  // Clean the collection
	  collection.deleteMany({}, {w:1}).then(function () {
	  	// Insert a bunch of documents for the index
	  	return collection.insertMany([{a:1, b:1}, {a:2, b:2}, {a:3, b:3}, {a:4, b:4}], {w:1});
	  }).then(function () {
	    // Create an index on the a field
	    return collection.ensureIndex({a:1, b:1}, {unique:true, background:true, w:1});
		}).then(function(indexName) {
      // Fetch basic indexInformation for collection
      return db.indexInformation('more_index_information_test_2');
    }).then(function(indexInformation) {
      assert.deepEqual([ [ '_id', 1 ] ], indexInformation._id_);
      assert.deepEqual([ [ 'a', 1 ], [ 'b', 1 ] ], indexInformation.a_1_b_1);

      // Fetch full index information
      return collection.indexInformation({full:true});
    }).then(function(indexInformation) {
      assert.deepEqual({ _id: 1 }, indexInformation[0].key);
      assert.deepEqual({ a: 1, b: 1 }, indexInformation[1].key);
      done()
    }, function (err) {
    	done(err)
    });
	})

	it('should return collection name', function (done) {
		var collection = db.collection('test_collection_name')
		collection.deleteMany({},{w:1}).then(function () {
			return collection.insertMany([{a:1,b:2}, {a:3,b:4}],{w:1});
		}).then(function () {
			assert.equal('test_collection_name', collection.collectionName);
			done();
		}, function (err) {
			done(err);
		})
	})
	
	describe('aggregate', function () {
		it('should execute an aggregation framework pipeline against the collection', function (done) {
			var docs = [{
	      title : "this is my title", author : "bob", posted : new Date() ,
	      pageViews : 5, tags : [ "fun" , "good" , "fun" ], other : { foo : 5 },
	      comments : [
	        { author :"joe", text : "this is cool" }, { author :"sam", text : "this is bad" }
	      ]}];

		  // Create a collection
		  var collection = db.collection('aggregationExample1');
		  // Remove the docs
		  collection.deleteMany({}, {w:1}).then(function () {
		  	// Insert the docs
		  	return collection.insertMany(docs, {w: 1});
		  }).then(function(result) {
		    // Execute aggregate, notice the pipeline is expressed as an Array
		    var promise = collection.aggregate([
		        { $project : {
		          author : 1,
		          tags : 1
		        }},
		        { $unwind : "$tags" },
		        { $group : {
		          _id : {tags : "$tags"},
		          authors : { $addToSet : "$author" }
		        }}
		    ]);

		    assert.ok(_.isUndefined(promise.toArray));

		    return promise;
		  }).then(function(result) {
	      assert.equal('good', result[0]._id.tags);
	      assert.deepEqual(['bob'], result[0].authors);
	      assert.equal('fun', result[1]._id.tags);
	      assert.deepEqual(['bob'], result[1].authors);
	      done();
		  }, function (err) {
		  	done(err);
		  });
		});

		it('should correctly call the aggregation using a cursor', function (done) {
			var docs = [{
		    title : "this is my title", author : "bob", posted : new Date() ,
		    pageViews : 5, tags : [ "fun" , "good" , "fun" ], other : { foo : 5 },
		    comments : [
		      { author :"joe", text : "this is cool" }, { author :"sam", text : "this is bad" }
		    ]
		  }];

			// Create a collection
			var collection = db.collection('aggregationExample2');
			// Remove the docs, for safe
			collection.deleteMany({},{w:1}).then(function () {
				// Insert the docs
		  	return collection.insertMany(docs, {w: 1});
		  }).then(function(result) {

			  // Execute aggregate, notice the pipeline is expressed as an Array
			  var cursor = collection.aggregate([
		      { $project : {
		        author : 1,
		        tags : 1
		      }},
		      { $unwind : "$tags" },
		      { $group : {
		        _id : {tags : "$tags"},
		        authors : { $addToSet : "$author" }
		      }}
		    ], { cursor: { batchSize: 1 } });

			  cursor.once('error', function (err) {
		    	done(err);
		    });

			  // Get all the aggregation results
			  cursor.toArray(function(err, docs) {
		      assert.equal(null, err);
		      assert.equal(2, docs.length);
		      done();
		    });
			}).then(function(docs) {
		    assert.equal(2, docs.length);
		  }, function (err) {
		  	done(err);
		  });
		});

		it('should correctly call the aggregation using a read stream', function (done) {
			// Some docs for insertion
		  var docs = [{
		      title : "this is my title", author : "bob", posted : new Date() ,
		      pageViews : 5, tags : [ "fun" , "good" , "fun" ], other : { foo : 5 },
		      comments : [
		        { author :"joe", text : "this is cool" }, { author :"sam", text : "this is bad" }
		      ]}];

		  // Create a collection
		  var collection = db.collection('aggregationExample3');
	 		// Remove the docs
		  collection.deleteMany({},{w:1}).then(function () {
		 		// Insert the docs
		  	return collection.insertMany(docs, {w: 1});
		  }).then(function(result) {
		    // Execute aggregate, notice the pipeline is expressed as an Array
		    var cursor = collection.aggregate([
		        { $project : {
		          author : 1,
		          tags : 1
		        }},
		        { $unwind : "$tags" },
		        { $group : {
		          _id : {tags : "$tags"},
		          authors : { $addToSet : "$author" }
		        }}
		      ], { cursor: { batchSize: 1 } });

		    var count = 0;
		    // Get all the aggregation results
		    cursor.on('data', function(doc) {
		      count = count + 1;
		    });

		    cursor.once('end', function() {
		      assert.equal(2, count);
		      done();
		    });

		    cursor.once('error', function (err) {
		    	done(err);
		    });
		  }, function (err) {
		  	done(err);
		  });
		})
	})
})