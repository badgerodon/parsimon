var PEG = require('pegjs'),
  fs = require('fs'),
  util = require('util'),
  Locator = require('./locator.js').Locator;

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
  _transform: function(name, data, expressionTree, callback) {
    var visit = function(parent, exp) {
      var o = {
        'locator': new Locator(name, data, exp.pos),
        'parent': parent
      };

      switch(exp.type || '') {
      case 'program':
        o.type = 'program';
        o.block = {
          'type': 'block',
          'scope': {},
          'locator': o.locator
        };
        o.block.expressions = exp.expressions.map(function(x) { return visit(o.block, x); });
        break;
      case 'binary':
        switch(exp.op) {
        case '=':
          o.type = 'assignment';
          o.left = visit(o, exp.left);
          o.right = visit(o, exp.right);
          break;
        }
        break;
      case 'member':
        o.type = 'member';
        o.left = visit(o, exp.left);
        o.right = visit(o, exp.right);
        break;
      case 'class_member':
        o.type = 'class_member';
        o.left = visit(o, exp.left);
        o.right = visit(o, exp.right);
        break;
      case 'record_definition':
        o.type = 'record_definition';
        o.fields = exp.fields.map(function(x) { return visit(o, x); });
        break;
      case 'record_definition_field':
        o.type = 'record_definition_field';
        o.type_reference = exp.type_reference;
        o.name = exp.name;
        break;
      case 'function_definition':
        o.type = 'function_definition';
        o.parameters = exp.parameters.map(function(x) { return visit(o, x); });
        break;
      case 'function_definition_parameter':
        o.type = 'function_definition_parameter';
        o.type_reference = exp.type_reference;
        o.name = exp.name;
        break;
      case '':
        o.type = 'identifier';
        o.value = exp;
      default:
        break;
      }
      return o;
    };
    pp(expressionTree);
    var tree = visit(null, expressionTree);
    callback(null, tree);
  },
  /**
   * Parse source code
   * @param {String} data The data to parse
   */
  parse: function(name, data, callback) {
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
        console.error("\n" + e.line + "\n    " + l + "\n    " + s.join('') + "^");
        console.error("SyntaxError: " + e.message);
        callback(true, null);
        return;
      }

      self._transform(name, data, tree, callback);
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