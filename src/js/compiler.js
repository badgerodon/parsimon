var fs = require('fs'),
  Parser = require('./parser.js').Parser,
  JavascriptGenerator = require('./javascript_generator.js').JavascriptGenerator,
  argv = require('optimist')
    .usage('Usage: $0 -o [output] -i [input]')
    .demand(['o', 'i'])
    .argv;

fs.readFile(argv.i, 'UTF-8', function(err, input) {
  if (err) {
    throw err;
  }

  var parser = new Parser();
  parser.parse(input, function(err, tree) {
    if (err) {
      throw err;
    }
    var generator = new JavascriptGenerator();
    generator.generate(tree, function(err, code) {
      if (err) {
        throw err;
      }
      console.log(code);
    });
  });
});