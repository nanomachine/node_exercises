var http = require("http");
var url = require("url");

function start(route, handle) {
	//Request response handler, serverver starts but always comes back here
  function onRequest(request, response) {
  	//Parsing incoming string
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    //retrieving requestHandler output, routing to respective action
    var content = route(handle, pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(content);
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;