var util = require('util');

function pp() {
  for (var i=0; i<arguments.length; i++) {
    console.log(util.inspect(arguments[i], true, 100, true));
  }
}

Interpreter = {
  symbols: {},
  symbol_count: 0,
  kind_to_record: {},
  
  to_symbol: function(str) {
    if (!this.symbols[str]) {
      this.symbols[str] = ++this.symbol_count;
    }
    return this.symbols[str];
  },
 
  mk_error: function(msg) {      
    return {
      kind: this.to_symbol("Error"),
      value: msg,
      fields: []
    };
  },
  mk_function: function(f) {
    return {
      kind: this.to_symbol("Function"),
      value: f,
      fields: []
    };
  },
  mk_global_scope: function() {
    var scope = this.mk_scope();
    
    var types = [
      "Error",
      "Record",
      "Module",
      
      "Boolean",
      "Integer",
      "Float",
      "Reference",
      "Function",
      "NativeFunction"
    ];
    for (var i=0; i<types.length; i++) {
      var rec = this.mk_record();
      this.kind_to_record[this.to_symbol(types[i])] = rec;
      this.set(scope, this.to_symbol(types[i]), rec);
    }
    
    var c = this.mk_module();
    this.set(c, this.to_symbol("log"), this.mk_native_function(function() {
      //pp(arguments);
      return this.mk_null();
    }));
    this.set(scope, this.to_symbol("Console"), c);
    
    return scope;
  },
  mk_module: function() {
    return {
      kind: this.to_symbol("Module"),
      value: null,
      fields: []
    }
  },
  mk_native_function: function(f) {
    return {
      kind: this.to_symbol("NativeFunction"),
      value: f,
      fields: []
    };      
  },
  mk_null: function() {      
    return {
      kind: this.to_symbol("Null"),
      value: null,
      fields: []
    };
  },
  mk_record: function() {      
    var r = {
      kind: this.to_symbol("Record"),
      value: {
        id: this.symbol_count++,
        parameters: []
      },
      fields: []
    };
    this.kind_to_record[r.value.id] = r;
    return r;
  },
  mk_reference: function(value) {      
    return {
      kind: this.to_symbol("Reference"),
      value: value,
      fields: []
    };
  },
  mk_scope: function(parent) {
    return {
      kind: this.to_symbol("Scope"),
      value: parent || null,
      fields: []
    };      
  },
  mk_string: function(str) {      
    return {
      kind: this.to_symbol("String"),
      value: str,
      fields: []
    };
  },
  
  binary_search: function(fields, symbol) {
    var imin=0,
      imax=fields.length-1,
      imid;
  
    while (imax >= imin) {
      imid = Math.round((imin + imax) / 2);
      // Must be on the right side
      if (fields[imid].symbol < symbol) {
        imin = imid + 1;
      // Must be on the left side
      } else if (fields[imid].symbol > symbol) {
        imax = imid - 1;
      // Found it
      } else {
        return imid;
      }
    }
    
    return -1;
  },
  get: function(parent, symbol) {
    var pos = this.binary_search(parent.fields, symbol);
    
    if (pos == -1) {
      return this.mk_error("Unknown Field");
    } else {
      return parent.fields[pos];
    }      
  },
  set: function(parent, symbol, child) {
    var pos = this.binary_search(parent.fields, symbol);
    
    // Create the field
    var field = {
      symbol: symbol,
      kind: child.kind,
      value: child.value,
      fields: child.fields
    };
    
    // Insert into new location
    if (pos == -1) {
      var fs = parent.fields;
      var inserted = false;
      for (var i=0; i<fs.length; i++) {
        if (fs[i].symbol > symbol) {
          if (!inserted) {
            fs.splice(i, 0, field);
            inserted = true;
          }
        }
      }
      if (!inserted) {
        fs.push(field);
      }
    // Replace existing
    } else {
      parent.fields[pos] = field;
    }      
  },
  invoke: function(scope, value, args) {
    if (value.kind == this.to_symbol("Function")) {
      var f = value.value;
      if (f.parameters.length != args.length) {
        return mk_error("Wrong # of arguments passsed to function");
      }
      
      var s = this.mk_scope(scope);
      for (var i=0; i<f.parameters.length; i++) {
        this.set(s, f.parameters[i], args[i]);
      }
      return this.execute(s, f.block);
    } else if (value.kind == this.to_symbol("NativeFunction")) {
      return value.value.apply(this, args);
    } else {
      return this.mk_error("Non-invokable object");
    }
  },
  
  execute: function(scope, block) {
    if (!scope) {
      scope = this.mk_global_scope();
    }
    
    var e = this.mk_null();
    for (var i=0; i<block.expressions.length; i++) {
      var exp = block.expressions[i];
      e = this.execute_expression(scope, exp);
      if (e.kind == this.to_symbol("Error") || exp.type == 'return') {
        break;
      }
    }
    
    return e;
  },
  execute_expression: function(scope, exp) {
    switch(exp.type) {
    case 'address':
      return this.execute_address(scope, exp);
    case 'assignment':
      return this.execute_assignment(scope, exp.left, exp.right);
    case 'constructor':
      return this.execute_constructor(scope, exp);
    case 'dereference':
      return this.execute_dereference(scope, exp);
    case 'function_definition':
      return this.execute_function_definition(scope, exp);
    case 'identifier':
      return this.execute_identifier(scope, exp);
    case 'invocation':
      return this.execute_invocation(scope, exp);
    case 'member':
      return this.execute_member(scope, exp);
    case 'null':
      return this.execute_null(scope, exp);
    case 'numeric_literal':
      return this.execute_numeric_literal(scope, exp);
    case 'record_definition':
      return this.execute_record_definition(scope, exp);
    case 'return':
      return this.execute_return(scope, exp);
    case 'typeof':
      return this.execute_typeof(scope, exp);
    }
    pp("UNKNOWN EXPRESSION: ", exp);
    return null;
  },
  execute_address: function(scope, exp) {
    var e = this.execute_expression(scope, exp.expression);
    if (e.kind == this.to_symbol("Error")) {
      return e;
    }
    return this.mk_reference(e);
  },
  execute_assignment: function(scope, left, right) {
    var root = scope;
    if (left.type != 'identifier') {
      root = this.execute_expression(scope, left.left);
      left = left.right;
    }
    if (root.kind === this.to_symbol("Error")) {
      return root;
    }
    var result = this.execute_expression(scope, right);
    if (result.kind == this.to_symbol("Error")) {
      return result;
    }
    this.set(root, this.to_symbol(left.value), result);
    return result;
  },
  execute_constructor: function(scope, exp) {      
    var e = this.execute_expression(scope, exp.expression);
    if (e.kind == this.to_symbol("Error")) {
      return e;
    }
    if (e.kind != this.to_symbol("Record")) {
      return mk_error("Can only construct a record using a record type");
    }
    var rec = e.value;
    if (rec.parameters.length != exp.arguments.length) {
      return mk_error("Wrong # of arguments passed to constructor");
    }
    var r = {
      kind: rec.id,
      value: null,
      fields: []
    };
    for (var i=0; i<rec.parameters.length; i++) {
      var a = this.execute_expression(scope, exp.arguments[i]);
      if (a.kind == this.to_symbol("Error")) {
        return a;
      }
      r.fields.push({
        symbol: rec.parameters[i],
        kind: a.kind,
        value: a.value,
        fields: a.fields
      });
    }
    return r;
  },
  execute_dereference: function(scope, exp) {
    var e = this.execute_expression(scope, exp.expression);
    if (e.kind == this.to_symbol("Error")) {
      return e;
    }
    if (e.kind !== this.to_symbol("Reference")) {
      return this.mk_error("Can only dereference a reference type");
    }
    return e.value;
  },
  execute_function_definition: function(scope, exp) {
    return this.mk_function(exp);
  },
  execute_identifier: function(scope, exp) {
    return this.get(scope, this.to_symbol(exp.value));
  },
  execute_invocation: function(scope, exp) {
    var e = this.execute_expression(scope, exp.expression);
    var args = [];
    for (var i=0; i<exp.arguments.length; i++) {
      var a = this.execute_expression(scope, exp.arguments[i]);
      if (a.kind == this.to_symbol("Error")) {
        return a;
      }
      args.push(a);
    }
    return this.invoke(scope, e, args);
  },
  execute_member: function(scope, exp) {
    var r = {};
    var left = this.execute_expression(scope, exp.left);
    return this.get(left, this.to_symbol(exp.right.value));
  },
  execute_null: function(scope, exp) {
    return {
      kind: this.to_symbol("Null"),
      value: null,
      fields: []
    };
  },
  execute_numeric_literal: function(scope, exp) {
    return {
      kind: this.to_symbol("Integer"),
      value: exp.value,
      fields: []
    };
  },
  execute_record_definition: function(scope, record) {
    var r = this.mk_record();
    for (var i=0; i<record.fields.length; i++) {
      r.value.parameters.push(this.to_symbol(record.fields[i].name));
    }
    return r;
  },
  execute_return: function(scope, exp) {
    var e = this.execute_expression(scope, exp.expression);
    return e;
  },
  execute_typeof: function(scope, exp) {
    var e = this.execute_expression(scope, exp.expression);
    if (e.kind == this.to_symbol("Error")) {
      return e;
    }
    if (!this.kind_to_record[e.kind]) {
      return this.mk_error("Unknown record type " + e.kind);
    }
    return this.kind_to_record[e.kind];
  }
};

function main() {
  pp("RESULT", Interpreter.execute(null, {
    type: 'block',
    expressions: [{
      type: 'assignment',
      left: {
        type: 'identifier',
        value: 'Node'
      },
      right: {
        type: 'record_definition',
        fields: [
          { type: 'record_definition_field', name: 'left' },
          { type: 'record_definition_field', name: 'right' },
          { type: 'record_definition_field', name: 'key' },
          { type: 'record_definition_field', name: 'value' }
        ]
      }
    }, {
      type: 'assignment',
      left: {
        type: 'identifier',
        value: 'Tree'
      },
      right: {
        type: 'record_definition',
        fields: [
          { type: 'record_definition_field', name: 'size' },
          { type: 'record_definition_field', name: 'root' }
        ]
      }
    }, {
      type: 'assignment',
      left: {
        type: 'member',
        left: {
          type: 'identifier',
          value: 'Tree'
        },
        right: {
          type: 'identifier',
          value: 'new'
        }
      },
      right: {
        type: 'function_definition',
        parameters: [],
        block: {
          type: 'block',
          expressions: [{
            type: 'return',
            expression: {
              type: 'address',
              expression: {
                type: 'constructor',
                expression: {
                  type: 'identifier',
                  value: 'Tree'
                },
                arguments: [
                  { type: 'numeric_literal', value: 0 },
                  { type: 'null' },
                ]
              }
            }
          }]
        }
      }
    }, {
      type: 'assignment',
      left: {
        type: 'identifier',
        value: 't'
      },
      right: {
        type: 'invocation',
        expression: {
          type: 'member',
          left: {
            type: 'identifier',
            value: 'Tree'
          },
          right: {
            type: 'identifier',
            value: 'new'
          }
        },
        arguments: []
      }
    }, {
      type: 'invocation',
      expression: {
        type: 'member',
        left: {
          type: 'identifier',
          value: 'Console'
        },
        right: {
          type: 'identifier',
          value: 'log'
        }
      },
      arguments: [{
        //type: 'typeof',
        //expression: {
        //  type: "dereference",
        //  expression: {
            type: 'identifier',
            value: 't'
        //  }
        //}
      }]
    }]
  }));
}

main();