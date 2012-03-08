var PEG = require('pegjs'),
	fs = require('fs');

fs.readFile("parsimon.pegjs", "UTF-8", function(err, data) {
	var parser = PEG.buildParser(data);

	var e2 = "record { left ^Node, right, key, value }";
	var r2 = parser.parse(e2);
	console.log(r2);

	var e3 = "func(x,y) { }";
	var r3 = parser.parse(e3);
	console.log(r3);

	var e4 = "Node = record { left ^Node, right ^Node, key, value }";
	var r4 = parser.parse(e4);
	console.dir(JSON.stringify(r4));
})