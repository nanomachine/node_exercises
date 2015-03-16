var http = require("http");
var url = require("url");

function start(route) {
	//Request response handler, serverver starts but always comes back here
  function onRequest(request, response) {
  	//Parsing incoming string
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    //routing to respective action
    route(pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;