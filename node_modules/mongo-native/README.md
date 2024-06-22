# mongo-native

Native MongoDB API with promises just to make you happy.

We're just following the `mongodb` npm package api, which you can check [here](http://mongodb.github.io/node-mongodb-native/2.0/api/).

### Installation (npm)
```
npm install --save mongo-native
```

### Examples
```js
var MongoNative = require('mongo-native');

MongoNative.connect('mongodb://localhost/native-db').then(function (db) {
	var users = db.collection('users');

	users.insertMany([{name: 'kris kowal'}, {name: 'tj'}, {name: 'douglas crockford'}]).then(function (docs) {
		assert.equal('kris kowal', docs[0].name);
	});
});
```

```js
db.collection('users', function (err, users) {
	if(err) {
		throw err;
	}

	users.insertOne({name: 'addy osmani'}).then(function (user) {
		assert.equal('addy osmani', user.name);
	});
});
```

```js
var Db = require('mongo-native').Db;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb://localhost/mydb', function (err, db) {
	if(err) {
		throw err;
	}

	global.db = new Db(db);
});

app.listen(3000, function () {
	console.log('Everything is cool now');
});
```

```js
var docs = [{
  title : "this is my title", author : "bob", posted : new Date() ,
  pageViews : 5, tags : [ "fun" , "good" , "fun" ], other : { foo : 5 },
  comments : [
    { author :"joe", text : "this is cool" }, { author :"sam", text : "this is bad" }
  ]}];

// Create a collection
var collection = db.collection('aggregationExample1');
// Insert the docs
collection.deleteMany({}, {w:1}).then(function () {
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

  return promise;
}).then(function(result) {
  res.json(result);
}, function (err) {
	console.log(err);
	res.status(400).end();
});
```

```js
MongoNative.connect('mongodb://localhost/mydb').then(function (db) {
	var users = db.collection('users');
	return users.find();
}).then(function (users) {
	assert.equal(300000, users.length);
});
```

Do you mean... [More examples](https://github.com/VictorQueiroz/mongo-native/tree/master/test/unit)? o: