var http = require('http');
var url = require('url');
var util = require('util');
var graph = require('./graph.js');
var querystring = require('querystring');
var fs = require('fs');

util.log('started');

var index= "";

process.__defineGetter__('stdout', function() { 
	return fs.createWriteStream('log', {'flags': 'a'}); 
}); 

process.__defineGetter__('stderr', function() { 
	return fs.createWriteStream('errlog', {'flags': 'a'}); 
}); 

fs.readFile('htdocs/index.html', function(err, data) {
	if(err)
		util.log(err);
	else {	
		index = index + data;
	}
});

var srv = http.createServer(function(req, res) {
	var reqUrl = url.parse(req.url);
	var query = querystring.parse(reqUrl.query);
	if(/\?/.test(req.url)) {
		res.writeHead(200, {
			'content-type': 	'text/html',
		});
		graph.getEdgeList(query.username, function(edgeList) {
			data = index.replace(/\/\/replace_me/, 'var edgeList = ' + JSON.stringify(edgeList) + ';');
			res.end(data);
		});
	}
	else{
		if(reqUrl.path === '/' || reqUrl.path ==='/index.html')
		{
			res.writeHead(200, {
				'content-type': 	'text/html',
			});
			res.end(index);
		} else {
			if(/\.\./.test(reqUrl.path)) {
				res.writeHead(403);
				res.end('That\'s not the file you are looking for');
			} else {
				fs.readFile('./htdocs'+reqUrl.path, function(err, data) {
					if(err) {
						res.writeHead(404);
						res.end('404 - File Not Found');
						util.log('File Not Found in htdocs: ' + reqUrl.path);
					} else {
						res.writeHead(200);
						res.end(data);
					}
				});
			}
		}
	}
});


srv.listen(8080, '0.0.0.0');
