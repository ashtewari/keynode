
var fs = require('fs');

var settings = global.appsettings;
var dbHost = process.env.IP || settings.get('db_host'),
	dbPort = settings.get('db_port'),
	dbName = settings.get('db_name'),
	tblName = settings.get('tbl_name'),
	dbUrl = settings.get('db_url');

var collection;

function connect(callback) {
	if (collection == undefined) {
		var mongodb = require('mongodb'),
		mongoClient = mongodb.MongoClient;
		mongoClient.connect(dbUrl, function (error, db) {
			if (error) {
				console.error(error);
				callback(error, undefined);
				return;
			}
			collection = db.collection(tblName);
			callback(error, collection);
		});
	} else {
		callback(null, collection);
	}		
	}	

exports.connect = connect;
