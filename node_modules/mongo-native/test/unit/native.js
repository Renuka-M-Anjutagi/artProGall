var MongoNative = require('../../index');

describe('native', function () {
	it('should return a native.Db instance when connected', function (done) {
		MongoNative.connect('mongodb://localhost/mydbtest').then(function (db) {
			assert.ok(db instanceof MongoNative.Db);
			done();
		}, function (err) {
			done(err)
		})
	})
})