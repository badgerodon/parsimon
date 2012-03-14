var Generator = require('./base').Generator,
  GeneratorException = require('./base').GeneratorException;

var CGenerator = function() {
  Generator.call(this);
};
CGenerator.prototype = new Generator;
CGenerator.prototype.generate = function(tree, callback) {
  this._initialize(tree);
  this._match_types(tree);

  var code = [];
  try {
    var state = {};
    this._define_includes(state, tree, code);
    this._define_records(state, tree, code);
    this._define_functions(state, tree, code);

    //this.visit(tree, code);
    callback(null, code.join(''));
  } catch(e) {
    if (e instanceof GeneratorException) {
      callback(e, code.join(''));
    } else {
      throw e;
    }
  }
};
CGenerator.prototype._define_includes = function(state, tree, code) {
  code.push('#include <stdio.h>\n#include <stdint.h>\n#include <string.h>\n#include <gc.h>\n\n');
};
CGenerator.prototype._define_records = function(state, tree, code) {
  state.records = [];
  var visit = function(exp) {
    switch(exp.type) {
    case 'assignment':
      visit(exp.right);
      break;
    case 'block':
      for (var i=0; i<exp.expressions.length; i++) {
        visit(exp.expressions[i]);
      }
      break;
    case 'record_definition':
      var name = 'S' + state.records.length;
      exp.name = name;
      code.push('struct ', name, ' ');
      if (exp.native) {
        code.push(exp.native);
      } else {
        code.push('{ ');
        for (var i=0; i<exp.fields.length; i++) {
          visit(exp.fields[i]);
        }
        code.push('}');
      }
      code.push(';\n');
      state.records.push(name);
      break;
    case 'record_definition_field':
      visit(exp.type_reference);
      code.push(' ', exp.name);
      code.push('; ');
      break;
    case 'type_reference':
      code.push('struct ', exp.value.name);
      for (var i=0; i<exp.pointer_count; i++) {
        code.push('*');
      }
      break;
    }
  };
  visit(tree.block);
};
CGenerator.prototype._define_functions = function(state, tree, code) {
  var self = this;
  state.functions = [];
  var visit = function(exp) {
    switch(exp.type) {
    case 'assignment':
      visit(exp.right);
      break;
    case 'block':
      for (var i=0; i<exp.expressions.length; i++) {
        visit(exp.expressions[i]);
      }
      break;
    case 'function_definition':
      var name = 'F' + state.functions.length;
      code.push('void ', name, ' (');

      for (var i=0; i<exp.parameters.length; i++) {
        if (i > 0) {
          code.push(',');
        }
        visit(exp.parameters[i]);
      }

      code.push(')');
      if (exp.native) {
        code.push(exp.native);
      } else {
        code.push('{\n');
        self._define_expressions(state, exp.expressions, code);
        code.push('}');
      }
      code.push(';\n');
      state.functions.push(name);
      return name;
      break;
    case 'function_definition_parameter':
      visit(exp.type_reference);
      code.push(' ', exp.name);
      break;
    case 'type_reference':
      code.push('struct ', exp.value.name);
      for (var i=0; i<exp.pointer_count; i++) {
        code.push('*');
      }
      break;
      break;
    case 'program':
      visit(exp.block);
      break;
    }
  };
  visit(tree);
};
CGenerator.prototype._define_expression = function(state, exp, code) {
  state.expression_count = 0;
  switch(exp.type) {
  case 'assignment':
    if (exp.right.type == 'string') {

    }
    break;
  }
};
CGenerator.prototype._initialize = function(tree) {
  var records = {
    'Any': {
      'native': '{ uint32_t kind; void* ptr; }',
      'fields': [],
      'properties': {
        'to_any': {
          'type': 'function',
          'native': [
            'struct Any Any_to_any(struct Any this)',
            'struct Any Any_to_any(struct Any this) { return this; }'
          ],
          'parameters': [{ 'type': 'Any', 'name': 'this' }],
          'returnType': 'Any'
        }
      }
    },
    'Boolean': {
      'native': '{ uint8_t value; }',
      'fields': [],
      'properties': {}
    },
    'Integer': {
      'native': '{ int64_t value; }',
      'fields': [],
      'properties': {}
    },
    'Float': {
      'native': '{ double value; }',
    },
    'String': {
      'native': '{ uint64_t length; void* chars; }',
      'fields': [],
      'properties': {}
    }
  };
  var offset = 0;
  for (var name in records) {
    records[name].type = 'record_definition';
    var id = {
      'type': 'identifier',
      'value': name
    };
    var assignment = {
      'type': 'assignment',
      'left': id,
      'right': records[name]
    };
    assignment.parent = tree.block;
    id.parent = assignment;

    tree.block.expressions.splice(offset++, 0, assignment);
  }
};
CGenerator.prototype.visit = function(state, exp, output) {
  switch(exp.type) {
  case 'program':
    this.define_structs(exp.block, output);
    this.visit(exp.block, output);
    break;
  case 'assignment':
    if (exp.left.type == 'identifier') {
      var v = exp.left.value;
      var e = exp;
      while (e) {
        if (e.type == 'block' && e.scope[v]) {
          e.scope[v] = exp.right;
          output.push('$', e.value, '$', ' = ');
          this.visit(exp.right, output);
          return;
        }
        e = e.parent;
      }
      e = exp;
      while (e) {
        if (e.type == 'block') {
          e.scope[v] = exp.right;
          output.push('var $', v, '$', ' = ');
          this.visit(exp.right, output);
          return;
        }
        e = e.parent;
      }
      this.raise(exp.left, "Assignment must happen within a block");
    } else if (exp.left.type == 'member') {

    } else {
      this.raise(exp.left, "Can only assign to a variable or a member of a variable");
    }
    break;
  case 'block':
    output.push('(function() {');
    for (var i=0; i<exp.expressions.length; i++) {
      var child = exp.expressions[i];
      this.visit(child, output);
      output.push(';');
    }
    output.push('})()');
    break;
  case 'record_definition':
    // Check fields
    output.push('{}');
    break;
  }
};

exports.CGenerator = CGenerator;