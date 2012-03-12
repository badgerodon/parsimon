var fs = require('fs'),
  Parser = require('./parser.js').Parser,
  JavascriptGenerator = require('./javascript_generator.js').JavascriptGenerator,
  GeneratorException = require('./generator.js').GeneratorException,
  argv = require('optimist')
    .usage('Usage: $0 -o [output] -i [input]')
    .demand(['o', 'i'])
    .argv;

fs.readFile(argv.i, 'UTF-8', function(err, input) {
  if (err) {
    throw err;
  }

  var parser = new Parser();
  parser.parse(argv.i, input, function(err, tree) {
    if (err) {
      throw err;
    }
    var generator = new JavascriptGenerator();
    generator.generate(tree, function(err, code) {
      if (err) {
        console.error(err.toString());
        return;
      }
      console.log("RESULT: ", code);
    });
  });
});