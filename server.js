var http = require('http');
var url = require('url');
var util = require('util');
var graph = require('./graph.js');

var srv = http.createServer(function(req, res) {
	res.writeHead(200, {
		'content-type': 	'application/json',
	});
	var reqUrl = url.parse(req.url);
	graph.getEdgeList(reqUrl.query, function(edgeList) {
		res.end(JSON.stringify(edgeList));
	});
});


srv.listen(8080, 'localhost');
