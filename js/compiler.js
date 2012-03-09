var PEG = require('pegjs'),
  fs = require('fs'),
  util = require('util'),
  argv = require('optimist')
    .usage('Usage: $0 -o [output] -i [input]')
    .demand(['o', 'i'])
    .argv;

function pp(obj) {
  console.log(util.inspect(obj, true, 100, true));
}

function get_variable(scope, node) {
  if (typeof(node) == 'string') {
    while (scope != null) {
      if (scope.variables[node]) {
        return scope.variables[node];
      }
      scope = scope.parent;
    }
    throw new Exception("Unknown variable: " + node);
  } else if (node.type == 'member') {
    
  }
}

function process_scope(parent, node, output) {
  var scope = {
    parent: parent,
    depth: parent ? parent.depth+1 : 0,
    node: node,
    
    records: {},
    functions: {}
  };

  var vars = {};
  for (var i=0; i<node.expressions.length; i++) {
    var n = node.expressions[i];
    if (n.type == 'binary' && n.op == '=') {
      switch(n.right.type) {
      case 'record':
        scope.records
        break;
      }
      // Simple variable
      if (typeof(n.left) == 'string') {
        scope.variables[n.left] = {
          name: n.left
        };
      } else {
        pp(n.left);
      }
    }
  }
}

function process_program(node, output) {
  process_scope(null, node, output);
}

function process(node, output) {
  switch(node.type) {
  case 'program':
    process_program(node, output);
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