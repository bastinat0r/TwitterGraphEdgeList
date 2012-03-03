var search = require('./search');
var util = require('util');

function getOuterNodeEdges(outerNodes, edges, callback) {
	if(outerNodes.length > 0) {
		var name = outerNodes.pop();
		getOutEdges(name, function(incoming) {
			for(inc in incoming) {
				edges.push({'in':inc, 'out' : name, weight : incoming[inc]});
			}
			getOuterNodeEdges(outerNodes, edges, callback);
		});
	} else {
		callback(edges);
	}
}

function getOutEdges(name, callback) {
	util.puts('getting out edges for @' + name);
	var incoming = [];
	search.request('@'+name, function(answer) {
		tweets = JSON.parse(answer);
		/* get outgoing edges */
		for(i in tweets.results) {
			var x = tweets.results[i].from_user;
			if(incoming[x] > 0)
				incoming[x]++;
			else
				incoming[x] = 1;
		}
		callback(incoming);
	});
}

module.exports.getEdgeList = function (name, callback) {
	util.puts('getting edge list for @'+ name);
	var edges = [];
	try {
		getOutEdges(name, function(incoming) {
			var outerNodes = [];
			for(inc in incoming) {
				edges.push({'in':name, 'out' : inc, weight : incoming[inc]});
				outerNodes.push(inc);
			};
			util.puts(JSON.stringify(outerNodes));
			getOuterNodeEdges(outerNodes, edges, callback);
		});

	} catch (err) {
		util.puts(err);
		
		util.puts('While parsing: ');
		util.puts(answer);
	}
};



/*
getEdgeList('Bastinat0r', function(edges) {
	util.puts(JSON.strinify(edges));
});
*/
