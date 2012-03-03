var http = require('http');
var url = require('url');
var util = require('util');
var graph = require('./graph.js');
var querystring = require('querystring');
var fs = require('fs');

var index= "";

fs.readFile('htdocs/index.html', function(err, data) {
	if(err)
		util.puts(err);
	else {	
		index = index + data;
	}
});

var srv = http.createServer(function(req, res) {
	res.writeHead(200, {
		'content-type': 	'text/html',
	});
	var reqUrl = url.parse(req.url);
	var query = querystring.parse(reqUrl.query);
	if(/\?/.test(req.url)) {
		graph.getEdgeList(query.username, function(edgeList) {
			data = index.replace(/\/\/replace_me/, 'var edgeList = ' + JSON.stringify(edgeList) + ';');
			util.puts(data);
			res.end(data);
		});
	}
	else{
		res.end(index);
	}
});


srv.listen(8080, 'localhost');
