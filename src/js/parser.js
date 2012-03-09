var PEG = require('pegjs'),
  fs = require('fs'),
  util = require('util');

var Parser = function() {

};
Parser.prototype = {
  _getParser: function(callback) {
    var self = this;
    if (this._parser) {
      callback(this._parser);
    } else {
      fs.readFile(__dirname + "/../grammar/parsimon.pegjs", "UTF-8", function(err, data) {
        if (err) {
          throw err;
        }
        self._parser = PEG.buildParser(data);
        callback(self._parser);
      });
    }
  },
  /**
   * Transform the raw PEG expression tree into a corresponding language tree
   */
  _transform: function(expressionTree, callback) {

  },
  /**
   * Parse source code
   * @param {String} data The data to parse
   */
  parse: function(data, callback) {
    var self = this;

    this._getParser(function(parser) {
      var tree;
      try {
        tree = parser.parse(data);
      } catch(e) {
        var l = (data.split(/[\r\n]/g)[e.line-1] || '').replace(/[\t]/g, ' ');
        var s = [];
        for (var i=0; i<e.column-1; i++) {
          s.push(' ');
        }
        console.error("\n" + argv.i + ":" + e.line + "\n    " + l + "\n    " + s.join('') + "^");
        console.error("SyntaxError: " + e.message);
        callback(true, null);
        return;
      }

      self._transform(tree, callback);
    });
  }
};

exports.Parser = Parser;




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