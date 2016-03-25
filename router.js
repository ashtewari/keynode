var fs = require("fs");
var path = require("path");
var mime = require("mime");

function route(handle, pathname, response, request, postedData) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request, postedData);
  } else {
        var filePath = "./public" + request.url;
        serverWorking(response, filePath);
  }
}

function send404(pathname, response) {
  console.log("No request handler found for " + pathname);
  response.writeHead(404, {"Content-type" : "text/plain"});
  response.write("Error 404: resource not found");
  response.end();
}

function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

function serverWorking(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response)
        } else {
          sendPage(response, absPath, data);
        }
      });
    } else {
      send404(absPath, response);
    }
  });
}

exports.route = route;