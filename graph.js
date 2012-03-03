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
	var incoming = [];
	search.request('@'+name, function(answer) {
		try {
			var tweets = JSON.parse(answer);
			/* get outgoing edges */
			for(i in tweets.results) {
				var x = tweets.results[i].from_user;
				if(incoming[x] > 0)
					incoming[x]++;
				else
					incoming[x] = 1;
			}
		} catch (err) {
				util.puts(err);
				util.puts(answer);
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

