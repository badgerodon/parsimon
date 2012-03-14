var GeneratorException = function(exp, msg) {
  this.expression = exp;
  this.message = msg;
};
GeneratorException.prototype.toString = function() {
  return "Generator Error: " + this.expression.locator + this.message + "\n";
};

var Generator = function() {
};
Generator.prototype = {
  _match_types: function(tree) {
    var self = this;
    var visit = function(exp) {
      switch(exp.type) {
      case 'assignment':
        if (exp.left.type == 'identifier') {
          var v = exp.left.value;
          var e = exp;
          while (e) {
            if (e.type == 'block' && e.scope[v]) {
              e.scope[v] = exp.right;
              visit(exp.right);
              return;
            }
            e = e.parent;
          }
          e = exp;
          while (e) {
            if (e.type == 'block') {
              e.scope[v] = exp.right;
              visit(exp.right);
              return;
            }
            e = e.parent;
          }
          self.raise(exp.left, "Assignment must happen within a block");
        } else if (exp.left.type == 'member') {
          visit(exp.right);
          // Not finished
        } else {
          self.raise(exp, "Not Implemented");
        }
        break;
      case 'block':
        for (var i=0; i<exp.expressions.length; i++) {
          visit(exp.expressions[i]);
        }
        break;
      case 'function_definition':
        for (var i=0; i<exp.parameters.length; i++) {
          visit(exp.parameters[i]);
        }
        break;
      case 'function_definition_parameter':
        var t = exp.type_reference || 'Any';
        var rt = t.replace(/\^/g, '');
        var e = exp;
        while (e) {
          if (e.type == 'block' && e.scope[rt]) {
            exp.type_reference = {
              'type': 'type_reference',
              'value': e.scope[rt],
              'pointer_count': t.length - rt.length
            };
            break;
          }
          e = e.parent;
        }
        if (!e) {
          self.raise(exp, 'Unknown Type: ' + t);
        }
        break;
      case 'program':
        visit(exp.block);
        break;
      case 'record_definition':
        for (var i=0; i<exp.fields.length; i++) {
          visit(exp.fields[i]);
        }
        break;
      case 'record_definition_field':
        var t = exp.type_reference || 'Any';
        var rt = t.replace(/\^/g, '');
        var e = exp;
        while (e) {
          if (e.type == 'block' && e.scope[rt]) {
            exp.type_reference = {
              'type': 'type_reference',
              'value': e.scope[rt],
              'pointer_count': t.length - rt.length
            };
            break;
          }
          e = e.parent;
        }
        if (!e) {
          self.raise(exp, 'Unknown Type: ' + t);
        }
        break;
      }
    };
    visit(tree);
  },
  generate: function() {
    throw "Not Implemented";
  },
  raise: function(exp, msg) {
    throw new GeneratorException(exp, msg);
  }
};

exports.Generator = Generator;
exports.GeneratorException = GeneratorException;