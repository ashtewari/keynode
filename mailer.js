﻿var fs = require('fs');
var nodemailer = require("nodemailer");

var settings = global.appsettings;
var username = settings.get('username'),
	password = settings.get('password'),
	sender = settings.get('sender'),
    websiteUrl = settings.get('product_website'),
    supportEmail = settings.get('product_support_email');    

var smtpTransport;

var dot = require("dot");
var tempText = fs.readFileSync("emailTextTemplate.txt");
var tempHtml = fs.readFileSync("emailHtmlTemplate.txt");

dot.templateSettings.strip = false;
var emailTextTemplate = dot.template(tempText);
var emailHtmlTemplate = dot.template(tempHtml);

function create() {
	// create reusable transport method (opens pool of SMTP connections)
	smtpTransport = nodemailer.createTransport("SMTP", {
		service: "Gmail",
		auth: {
			user: username,
			pass: password
		}
	});
}

function send(doc, license, collection) {

	var toAddress = doc.email;
	if (doc.test == true) {
		toAddress = username;
	}

	var licData = { name: doc.name, email: doc.email, id: doc.lic_id, expiration: doc.exp_date, product: doc.product, edition: doc.edition, version: doc.version, website: websiteUrl, support: supportEmail };
	var emailText = emailTextTemplate(licData);
	var emailHtml = emailHtmlTemplate(licData);
	
	// setup e-mail data with unicode symbols
	var mailOptions = {
		messageId: doc._id,
		from: sender, // sender address
		to: toAddress, // list of receivers
		bcc: username,
		replyTo: toAddress,
		subject: "Your " + doc.product + " License", // Subject line
		text: emailText, // plaintext body	
		html: emailHtml, // html body
		attachments: [{ 'filename': 'license.xml', 'contents': license }]
	};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions,
		(function (userName) {
			return function (e, response) {
				if (e) {
					console.log(e);
				} else {
					console.log("Message sent: " + response.message);

					collection.update({ _id: response.messageId }, { $set: { completed: 1 } }, { safe: true },
								function (err, objects) {
									if (err) console.warn(err.message);
									if (err && err.message.indexOf('E11000 ') !== -1) {
										// this _id was already inserted in the database
									}
									
									console.log("License sent to " + userName + ": " + response.messageId);
								});					
				}
			};
		})(doc.name)
	);
}

function close() {
	smtpTransport.close();
}

exports.create = create;
exports.send = send;
exports.close = close;