var randomstring = require('randomstring'); 

describe('admin', function () {
	var adminDb;

	beforeEach(function () {
		adminDb = db.admin()
	});

	it('should add a user to the database', function (done) {
    var username = randomstring.generate(7);

		// Add the new user to the admin database
	  adminDb.addUser(username, username).then(function(result) {
	    
	    // Authenticate using the newly added user
	    return adminDb.authenticate(username, username);                
	  }).then(function(result) {
      assert.ok(result);
      
      return adminDb.removeUser(username);
    }).then(function(result) {
      assert.ok(result);
      done();
    }, function (err) {
    	done(err);
    });
	});

	it('should retrieve this db\'s server status', function (done) {
		// Grab a collection object
	  var collection = db.collection('test');

	  // Force the creation of the collection by inserting a document
	  // Collections are not created until the first document is inserted
	  collection.insertOne({'a':1}, {w: 1}).then(function(doc) {

	    // Use the admin database for the operation
	    var adminDb = db.admin();

	    // Add the new user to the admin database
	    return adminDb.addUser('admin13', 'admin13');
	  }).then(function(result) {
      // Authenticate using the newly added user
      return adminDb.authenticate('admin13', 'admin13');
    }).then(function(result) {
       
      // Retrive the server Info
      return adminDb.serverStatus();
    }).then(function(info) {
      assert.ok(info != null);
     
      return adminDb.removeUser('admin13');
    }).then(function(result) {
      assert.ok(result);
      done()
    }, function (err) {
    	done(err)
    });
	});

	it('should validate an existing collection', function (done) {
		// Grab a collection object
	  var collection = db.collection('test');
	    
	  // Force the creation of the collection by inserting a document
	  // Collections are not created until the first document is inserted
	  collection.insertOne({'a':1}, {w: 1}).then(function(doc) {
	    
	    // Use the admin database for the operation
	    var adminDb = db.admin();
	      
	    // Add the new user to the admin database
	    return adminDb.addUser('admin8', 'admin8');
	  }).then(function(result) {
	      
      // Authenticate using the newly added user
      return adminDb.authenticate('admin8', 'admin8');                
    }).then(function(replies) {
      
      // Validate the 'test' collection
      return adminDb.validateCollection('test');
    }).then(function(doc) {
      // Pre 1.9.1 servers
      if(doc.result != null) {
        assert.ok(doc.result != null);
        assert.ok(doc.result.match(/firstExtent/) != null);                    
      } else {
        assert.ok(doc.firstExtent != null);
      }

      return adminDb.removeUser('admin8');
    }).then(function(result) {
      assert.ok(result);

      done();
    }, function (err) {
    	done(err)
    });
	});

  it('should retrieve the current profiling Level for MongoDB', function (done) {
    // Grab a collection object
    var collection = db.collection('test');
    var username = randomstring.generate(7);

    // Force the creation of the collection by inserting a document
    // Collections are not created until the first document is inserted
    collection.insertOne({'a':1}, {w: 1}).then(function(doc) {
      // Use the admin database for the operation
      var adminDb = db.admin();

      // Add the new user to the admin database
      return adminDb.addUser(username, username);
    }).then(function(result) {
      // Authenticate using the newly added user
      return adminDb.authenticate(username, username);
    }).then(function(replies) {
      // Retrive the profiling level
      return adminDb.profilingLevel();
    }).then(function(level) {
      return adminDb.removeUser(username);
    }).then(function(result) {
      assert.ok(result);
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should set the current profiling level of MongoDB', function (done) {
    // Grab a collection object
    var collection = db.collection('test');
    var username = randomstring.generate(7);

    // Force the creation of the collection by inserting a document
    // Collections are not created until the first document is inserted
    collection.insertOne({'a':1}, {w: 1}).then(function(doc) {
      // Use the admin database for the operation
      var adminDb = db.admin();

      // Add the new user to the admin database
      return adminDb.addUser(username, username);
    }).then(function(result) {
      // Authenticate using the newly added user
      return adminDb.authenticate(username, username)
    }).then(function(replies) {                                
      
      // Set the profiling level to only profile slow queries
      return adminDb.setProfilingLevel('slow_only')
    }).then(function(level) {
        
      // Retrive the profiling level and verify that it's set to slow_only
      return adminDb.profilingLevel()
    }).then(function(level) {
      assert.equal('slow_only', level);

      // Turn profiling off
      return adminDb.setProfilingLevel('off');
    }).then(function(level) {
      
      // Retrive the profiling level and verify that it's set to off
      return adminDb.profilingLevel()
    }).then(function(level) {
      assert.equal('off', level);

      // Set the profiling level to log all queries
      return adminDb.setProfilingLevel('all');
    }).then(function(level) {
      // Retrive the profiling level and verify that it's set to all
      return adminDb.profilingLevel()
    }).then(function(level) {
      assert.equal('all', level);

      // Attempt to set an illegal profiling level
      return adminDb.setProfilingLevel('medium');
    }).then(function () {
      done();
    }, function(err) {
      assert.ok(err instanceof Error);
      assert.equal("Error: illegal profiling level value medium", err.message);
    
      return adminDb.removeUser(username).then(function(result) {
        assert.ok(result);
        done();
      });
    });
  });

  it('should retrive the current profiling information for MongoDB', function (done) {
    // Grab a collection object
    var collection = db.collection('test');
    var username = randomstring.generate(7);

    // Force the creation of the collection by inserting a document
    // Collections are not created until the first document is inserted
    collection.insertOne({'a':1}, {w: 1}).then(function(doc) {
      // Use the admin database for the operation
      var adminDb = db.admin();

      // Add the new user to the admin database
      return adminDb.addUser(username, username);
    }).then(function(result) {
      // Authenticate using the newly added user
      return adminDb.authenticate(username, username);
    }).then(function(replies) {      
      // Set the profiling level to all
      return adminDb.setProfilingLevel('all');
    }).then(function(level) {      
      // Execute a query command
      collection.find();
    }).then(function(items) {
      // Turn off profiling
      return adminDb.setProfilingLevel('off');
    }).then(function(level) {
      
      // Retrive the profiling information
      return adminDb.profilingInfo();
    }).then(function(infos) {
      assert.ok(infos.constructor == Array);
      assert.ok(infos.length >= 1);
      assert.ok(infos[0].ts.constructor == Date);
      assert.ok(infos[0].millis.constructor == Number);
    
      return adminDb.removeUser(username);
    }).then(function(result) {
      assert.ok(result);
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should ping the MongoDB server and retrieve results', function (done) {
    // Use the admin database for the operation
    var adminDb = db.admin();
    var username = 'admin' + randomstring.generate(7);
      
    // Add the new user to the admin database
    adminDb.addUser(username, username).then(function(result) {
      
      // Authenticate using the newly added user
      adminDb.authenticate(username, username).then(function(result) {
        assert.ok(result);
        
        // Ping the server
        adminDb.ping().then(function(pingResult) {
          adminDb.removeUser(username).then(function(result) {
            assert.ok(result);
            done();
          }, function (err) {
            done(err);
          });
        });
      });
    });
  });

  it('should logout user from server, fire off on all connections and remove all auth info', function (done) {
    // Use the admin database for the operation
    var adminDb = db.admin();
    var username = randomstring.generate(7);
      
    // Add the new user to the admin database
    adminDb.addUser(username, username).then(function(result) {
      
      // Authenticate using the newly added user
      adminDb.authenticate(username, username).then(function(result) {
        assert.ok(result);
        
        // Logout the user
        adminDb.logout().then(function(result) {
          assert.equal(true, result);
          
          adminDb.removeUser(username).then(function(result) {
            assert.ok(result);
            done();
          });
        });
      });                
    });
  })

  it('should list the available databases', function (done) {
    // Use the admin database for the operation
    var adminDb = db.admin();
      
    // List all the available databases
    adminDb.listDatabases().then(function(dbs) {
      assert.ok(dbs.databases.length > 0);
      
      done();
    });
  })

  it('should execute a command', function (done) {
    // Use the admin database for the operation
    var adminDb = db.admin();
    var username = randomstring.generate(7);

    // Add the new user to the admin database
    adminDb.addUser(username, username).then(function(result) {
      // Authenticate using the newly added user
      return adminDb.authenticate(username, username);
    }).then(function(result) {
      assert.ok(result);
     
      // Retrive the build information using the admin command
      return adminDb.command({buildInfo:1});
    }).then(function(info) {
      return adminDb.removeUser(username);
    }).then(function(result) {
      assert.ok(result);
      done();
    }, function (err) {
      done(err);
    });
  });

  it('should retrieve the server information for the current instance of the db client', function (done) {
    // Use the admin database for the operation
    var adminDb = db.admin();
    var username = randomstring.generate(7);

    // Add the new user to the admin database
    adminDb.addUser(username, username).then(function(result) {

      // Authenticate using the newly added user
      adminDb.authenticate(username, username).then(function(result) {
        assert.ok(result);
        
        // Retrive the build information for the MongoDB instance
        adminDb.buildInfo().then(function(info) {          
          adminDb.removeUser(username).then(function(result) {
            assert.ok(result);
            done();
          });
        });
      });
    });
  })
});