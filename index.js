var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = { }

//Objects in js are key value pairs thus in handle 
//each url is the key mapping it to the appropriate requestHandler
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);