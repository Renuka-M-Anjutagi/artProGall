var Q = require('q');

module.exports = Cursor;

function Cursor(cursor) {
	this.cursor = cursor;
}

Cursor.prototype = {
	limit: function (value) {
		this.cursor.limit(value);

		return this;
	},

	isClosed: function () {
		return this.cursor.isClosed();
	},

	hasNext: function () {
		var deferred = Q.defer();

		this.cursor.hasNext(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	forEach: function (iterator) {
		var deferred = Q.defer();

		this.cursor.forEach(iterator, this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	filter: function (filter) {
		this.cursor.filter(filter);

		return this;
	},

	explain: function () {
		var deferred = Q.defer();

		return this.cursor.explain(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	/**
	 * Returns an array of documents. The caller is responsible for
	 * making sure that there is enough memory to store the results.
	 * Note that the array only contain partial results when this
	 * cursor had been previouly accessed. In that case, cursor.rewind()
	 * can be used to reset the cursor.
	 */
	toArray: function () {
		var deferred = Q.defer();

		this.cursor.toArray(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	/**
	 * Sets the sort order of the cursor query.
	 */
	sort: function (keyOrList, direction) {
		this.cursor.sort(keyOrList, direction);

		return this;
	},

	/**
	 * Return a modified Readable stream including
	 * a possible transform method.
	 */
	nextObject: function () {
		var deferred = Q.defer();

		this.cursor.nextObject(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	/**
	 * Set the batch size for the cursor.
	 */
	batchSize: function (value) {
		this.cursor.batchSize(value);

		return this;
	},

	/**
	 * Close the cursor, sending a KillCursor
	 * command and emitting close.
	 */
	close: function () {
		var deferred = Q.defer();

		this.cursor.close(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	/**
	 * Add a comment to the cursor query allowing
	 * for tracking the comment in the log.
	 */
	comment: function (value) {
		this.cursor.comment(value);

		return this;
	},

	/**
	 * Get the count of documents for this cursor
	 */
	count: function (applySkipLimit, options) {
		var deferred = Q.defer();

		this.cursor.count(applySkipLimit, options, this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	resultCallback: function (resolve, reject) {
		return function (err, result) {
			if(err) {
				return reject(err);
			}

			resolve(result);
		};
	}
};