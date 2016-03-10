/// <reference path="./nodelib/node.js" />

var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var postedData = "";
  		var pathname = url.parse(request.url).pathname;	  
  		console.log("Request for " + pathname + " received.");
		
  		request.setEncoding("utf8");

		request.addListener("data", function(chunk) {
			postedData += chunk;
		});

		request.addListener("end", function() {
			route(handle, pathname, response, request, postedData);
		});
	}

	var httpHost = process.env.IP || global.appsettings.get('http_host');
	var httpPort = process.env.PORT || global.appsettings.get('http_port');
	
    if(httpHost == undefined)
    {
        httpHost = 'Unknown';
    }
    
	console.log("Starting server on " + httpHost + ":" + httpPort);
	http.createServer(onRequest).listen(httpPort);
	
	console.log("Server has started.");
}

exports.start = start;