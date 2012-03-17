var util = require('util');

function pp() {
  for (var i=0; i<arguments.length; i++) {
    console.log(util.inspect(arguments[i], true, 100, true));
  }
}

Interpreter = (function() {
  S = 1;
  R = 1;
  SYMBOLS = {};
  function to_sym(str) {
    if (!SYMBOLS[str]) {
      SYMBOLS[str] = S++;
    }
    return SYMBOLS[str];
  }
  
  function binary_search(fields, symbol) {
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
  }
  
  function set(parent, symbol, child) {
    var pos = binary_search(parent.fields, symbol);
    
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
  }
  
  function get(parent, symbol, result) {
    var pos = binary_search(parent.fields, symbol);
    
    if (pos == -1) {
      result.kind = to_sym("Error");
      result.value = {
        message: "Unknown Field"
      };
      result.fields = [];
    } else {
      result.kind = parent.fields[pos].kind;
      result.value = parent.fields[pos].value;
      result.fields = parent.fields[pos].fields;
    }
  }
  
  function invoke(scope, value, args, result) {
    if (value.kind == to_sym("Function")) {
      var f = value.value;
      if (f.parameters.length != args.length) {
        result.kind = to_sym("Error");
        result.value = {
          message: "Wrong # of arguments passed to function"
        };
        result.fields = [];
        return;
      }
      
      var s = mk_scope(scope);
      for (var i=0; i<f.parameters.length; i++) {
        set(s, f.parameters[i], args[i]);
      }
      var r = Interpreter.execute(scope, f.block);
      result.kind = r.kind;
      result.value = r.value;
      result.fields = r.fields;
    } else if (value.kind == to_sym("NativeFunction")) {
      value.value(args, result);
    } else {
      result.kind = to_sym("Error");
      result.value = {
        message: "Non-invokable object"
      };
      result.fields = [];
    }
  }
  
  function mk_scope(parent) {
    return {
      kind: to_sym("Scope"),
      value: parent,
      fields: []
    };
  }
  function mk_module() {
    return {
      kind: to_sym("Module"),
      value: null,
      fields: []
    };
  }
  function mk_record() {
    return {
      kind: to_sym("Record"),
      value: R++,
      fields: []
    };
  }
  function mk_native_function(f) {
    return {
      kind: to_sym("NativeFunction"),
      value: f,
      fields: []
    };
  }
  function mk_function(f) {
    return {
      kind: to_sym("Function"),
      value: f,
      fields: []
    };
  }
  function mk_string(str) {
    return {
      kind: to_sym("String"),
      value: str,
      fields: []
    };
  }
  function mk_null() {
    return {
      kind: to_sym("Null"),
      value: null,
      fields: []
    };
  }
  function mk_reference(value) {
    return {
      kind: to_sym("Reference"),
      value: value,
      fields: []
    };
  }
  function mk_error(msg) {
    return {
      kind: to_sym("Error"),
      value: msg,
      fields: []
    };
  }
  
  function native_error_to_string(args, result) {
    result.kind = to_sym("String");
    result.value = args[0].value.message;
  }
  function native_integer_to_string(args, result) {
    var r = mk_string(args[0].value.toString());
    result.kind = r.kind;
    result.value = r.value;
    result.fields = r.fields;
  }
  function native_console_log(args, result) {
    console.log("Console.log", args);
    result.kind = to_sym("Null");
    result.value = null;
    result.fields = [];
  }
  
  function get_global_scope() {
    var global = mk_scope(null);
    
    var error = mk_record("Error");
    set(error, to_sym("to_string"), mk_native_function(native_error_to_string));
    set(global, to_sym("Error"), error);
    
    var integer = mk_record("Integer");
    set(integer, to_sym("to_string"), mk_native_function(native_integer_to_string));
    set(global, to_sym("Integer"), integer);
    
    var c = mk_module();
    set(c, to_sym("log"), mk_native_function(native_console_log));
    set(global, to_sym("Console"), c);
    
    return global;    
  }
  
  return {
    execute: function(scope, block) {
      if (!scope) {
        scope = get_global_scope();
      }
      
      var e = mk_null();
      for (var i=0; i<block.expressions.length; i++) {
        e = this.execute_expression(scope, block.expressions[i]);
        if (e.kind == to_sym("Error")) {
          break;
        }
      }
      
      //pp(SYMBOLS, scope, e);
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
      case 'function_definition':
        return this.execute_function_definition(scope, exp);
      case 'identifier':
        return this.execute_identifier(scope, exp);
      case 'invocation':
        return this.execute_invocation(scope, exp);
      case 'member':
        return this.execute_member(scope, exp);
      case 'record_definition':
        return this.execute_record_definition(scope, exp);
      case 'return':
        return this.execute_return(scope, exp);
      }
      console.error("UNKNOWN EXPRESSION: ", exp);
      return null;
    },
    execute_address: function(scope, exp) {
      var e = this.execute_expression(exp);
      if (e.type == to_sym("Error")) {
        return e;
      }
      return mk_reference(e);
    },
    execute_assignment: function(scope, left, right) {
      var root = scope;
      if (left.type != 'identifier') {
        root = this.execute_expression(scope, left.left);
        left = left.right;
      }
      var result = this.execute_expression(scope, right);
      if (result.kind == to_sym("Error")) {
        return result;
      }
      set(root, to_sym(left.value), result);
      return result;
    },
    execute_constructor: function(scope, exp) {      
      var e = this.execute_expression(scope, exp.record);
      if (e.kind == to_sym("Error")) {
        return e;
      }
      if (e.kind != to_sym("Record")) {
        return mk_error("Can only construct a record using a record type");
      }
      if (e.fields.length != exp.arguments.length) {
        return mk_error("Wrong # of arguments passed to constructor");
      }
      var r = {
        kind: 
      }
      for (var i=0; i<e.fields.length; i++) {
        var a = this.execute_expression(scope, e.arguments[i]);
        if (a.kind == to_sym("Error")) {
          return a;
        }
        
      }
    },
    execute_function_definition: function(scope, exp) {
      return mk_function(exp);
    },
    execute_identifier: function(scope, exp) {
      var r = {};
      get(scope, to_sym(exp.value), r);
      return r;
    },
    execute_invocation: function(scope, exp) {
      var e = this.execute_expression(scope, exp.expression);
      var args = [];
      for (var i=0; i<exp.arguments.length; i++) {
        var a = this.execute_expression(scope, exp.arguments[i]);
        if (a.kind == to_sym("Error")) {
          return a;
        }
        args.push(a);
      }
      var r = {};
      invoke(scope, e, args, r);
      return r;
    },
    execute_member: function(scope, exp) {
      var r = {};
      var left = this.execute_expression(scope, exp.left);
      get(left, to_sym(exp.right.value), r);
      return r;
    },
    execute_record_definition: function(scope, record) {
      var r = mk_record();
      r.value = [];
      for (var i=0; i<record.fields.length; i++) {
        r.value.push(to_sym(record.fields[i].name));
      }
      return r;
    }
  };
})();

function main() {
  Interpreter.execute(null, {
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
                record: {
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
        type: 'identifier',
        value: 't'
      }]
    }]
  });
}

main();