var guid = require('node-uuid');
var moment = require('moment');
var db = require('./db');
var lic = require('./license');
var mailer = require('./mailer');
var check = require('validator').check,
	sanitize = require('validator').sanitize;

var pollingFrequency = global.appsettings.get('polling-frequency');
var productName = global.appsettings.get('product_name');
var productVersion = global.appsettings.get('product_version');
var skuPro = global.appsettings.get('sku_pro');
var licYears = global.appsettings.get('license_duration_years');

function read() {
	db.connect(function (error, collection) {
		if (error) {
			console.error(error);
			return;
		}
		collection.find({ completed: 0 }, { limit: 0 }).toArray(function (err, docs) {
			if (err) {
				console.warn(err.message);
			} else {

				//todo : refactor this - async, close mailer only after ensuring that the last email has been processed
				for (var i = 0; i < docs.length; i++) {

					//create license
					var license = lic.create(docs[i]);

					if (license == undefined) {
						console.warn("undefined license returned by lic.create()");
					} else {
						//send it
						mailer.send(docs[i], license, collection);
					}

				};				
			}
		});
	});
}

function write(parsedInput) {
	db.connect(function (error, collection) {
		if (error) {
			console.error(error);
			return;
		}		

		var emailAddress = parsedInput.email;
		var permalink = parsedInput.permalink;
		var isTest = parsedInput.test || false;

		var fName = parsedInput["First Name"];
		var lName = parsedInput["Last Name"];

		var licId = guid.v4();
		var issueDate = moment();
		var expDate = moment().add('years', licYears).format("YYYY-MM-DDTHH:mm:ss.SSSSSSS");

		var isCompleted = permalink == skuPro ? 0 : 1;
		var edition = permalink == skuPro ? "Professional" : "Basic";
		var licType = "Standard";
		
		if (fName == undefined || lName == undefined || emailAddress == undefined) {
			isCompleted = 1;
		} else {
			fName = sanitize(fName).trim();
			lName = sanitize(lName).trim();
			emailAddress = sanitize(emailAddress).trim();
		}

		fName = sanitize(fName).xss();
		lName = sanitize(lName).xss();
		emailAddress = sanitize(emailAddress).xss();
		
		if (fName.length == 0 || lName.length == 0 || emailAddress.length == 0) {
			isCompleted = 1;
		}

		var userName = fName + " " + lName;
		userName = sanitize(userName).trim();

		collection.insert({
			name: userName, email: emailAddress, lic_id: licId, lic_type: licType,
			issue_date: issueDate.format("YYYY-MM-DDTHH:mm:ss.SSSSSSS"), exp_date: expDate,
			product: productName, version: productVersion, edition: edition,
			test: isTest, completed: isCompleted, input: parsedInput
		}, { safe: true },
			function(err, objects) {
				if (err) {
					console.warn(err.message);
					
					//todo : send an email to administrator
				}
				if (err && err.message.indexOf('E11000 ') !== -1) {
					// this _id was already inserted in the database
				}
			});
	});
}

(function start() {
	read();
	setTimeout(function () { process.nextTick(start); }, pollingFrequency);
})();

exports.write = write;
