var querystring = require("querystring");
var q = require("./queue");

var fs = require('fs');

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = fs.readFileSync("main.html");;

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function issue(response, request, postedData) {
	console.log("Request handler 'issue' was called.");

	var parsedInput = querystring.parse(postedData);

	q.write(parsedInput);
	
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("license request received.");
    response.end();
  };


function validate(response) {
  console.log("Request handler 'validate' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("license is valid.");
  response.end();
}

exports.start = start;
exports.issue = issue;
exports.validate = validate;