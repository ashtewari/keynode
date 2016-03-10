var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    
 var SignedXml = require('xml-crypto').SignedXml   
      , fs = require('fs')

    var xml = "<library>" +
                "<book>" +
                  "<name>Harry Potter</name>" +
                "</book>"
              "</library>"

    var sig = new SignedXml()
    sig.addReference("//*[local-name(.)='book']")    
    sig.signingKey = fs.readFileSync("code-demo-license-private.pem")
    sig.computeSignature(xml)  
    
    var doc = new Dom().parseFromString(xml)
    
    response.end(sig.getSignedXml());
}).listen(process.env.PORT, process.env.IP);

console.log('Server started');