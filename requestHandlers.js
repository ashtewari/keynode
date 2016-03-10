var querystring = require("querystring");
var q = require("./queue");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
	'<form name="input" action="issue" method="post">'+
		'First Name: <input type="text" name="First Name" required>' +
		'Last Name: <input type="text" name="Last Name" required>' +
        'Email address: <input type="email" name="email" required>' +
		'Product: <input type="text" value="Pro" name="permalink" required>' +
		'<input type="submit" value="Submit">'+
		'</form>'+
    '</body>'+
    '</html>';

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