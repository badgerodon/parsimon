var fs = require('fs'),
  Parser = require('./parser.js').Parser,
  JavascriptGenerator = require('./generators/javascript.js').JavascriptGenerator,
  CGenerator = require('./generators/c.js').CGenerator,
  GeneratorException = require('./generators/base.js').GeneratorException,
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
    var generator = new CGenerator();
    generator.generate(tree, function(err, code) {
      if (err) {
        console.error(err.toString());
        return;
      }
      console.log("RESULT: ", code);
    });
  });
});