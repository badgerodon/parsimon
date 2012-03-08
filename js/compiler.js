var PEG = require('pegjs'),
	fs = require('fs'),
	util = require('util'),
	argv = require('optimist')
		.usage('Usage: $0 -o [output] -i [input]')
		.demand(['o', 'i'])
		.argv;

function process(node, output) {
	switch(node.type) {
	case 'program':
		// (1) Create space for all assignments
		var vars = {};
		for (var i=0; i<node.expressions.length; i++) {
			var n = node.expressions[i];
			if (n.type == 'binary' && n.op == '=') {
				vars[n.left+""] = true;
			}
		}
		for (var v in vars) {
			output.push('var ' + v + ';');
		}
		break;
	}
}

fs.readFile("parsimon.pegjs", "UTF-8", function(err, data) {
	var parser = PEG.buildParser(data);

	fs.readFile(argv.i, "UTF-8", function(err, input) {
		try {
			var tree = parser.parse(input);
			console.log(util.inspect(tree, true, 100, true));
			var o = [];
			process(tree, o);
			console.log(o.join(''));
		} catch(e) {
			var l = (input.split(/[\r\n]/g)[e.line-1] || '').replace(/[\t]/g, ' ');
			var s = [];
			for (var i=0; i<e.column-1; i++) {
				s.push(' ');
			}
			console.error("\n" + argv.i + ":" + e.line + "\n    " + l + "\n    " + s.join('') + "^");
			console.error("SyntaxError: " + e.message);
		}
	});
});