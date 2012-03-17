var Generator = require('./base').Generator,
  GeneratorException = require('./base').GeneratorException;

var LLVMGenerator = function() {
  Generator.call(this);
};
LLVMGenerator.prototype = new Generator;
LLVMGenerator.prototype.generate = function(tree, callback) {
  this._initialize(tree);
  this._match_types(tree);

  var code = [];
  try {
    var state = {};
		this._define_header(state, code);
		this._define_symbols(state, tree, code);
    this._define_records(state, tree, code);
    //this._define_functions(state, tree, code);

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
LLVMGenerator.prototype._define_header = function(state, code) {
	code.push(
		'%struct.Value = type { i64, i64 }\n',
		'%struct.Record = type { i64, [0 x %struct.Value ] }'
	);
};
LLVMGenerator.prototype._define_symbols = function(state, tree, code) {
	state.symbols = {};
	var cnt = 0;
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
			for (var i=0; i<exp.fields.length; i++) {
				visit(exp.fields[i]);
			}
      break;
    case 'record_definition_field':
			if (!state.symbols[exp.name]) {
				state.symbols[exp.name] = cnt++;
			}
      break;
    }
  };
  visit(tree.block);
};
LLVMGenerator.prototype._define_records = function(state, tree, code) {
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
			exp.kind = state.records.length;
      exp.name = name;
      code.push('%struct.', name, ' = type {');
			for (var i=0; i<exp.fields.length; i++) {
				if (i > 0) {
					code.push(', ');
				}
				code.push('%struct.Value');
			}
      code.push('}\n');
      state.records.push(name);
      break;
    }
  };
  visit(tree.block);
	
	code.push('\n');
	code.push(
		'define void @get_property(%struct.Value* %value, i64 %symbol, %struct.Value* %result) nounwind uwtable {\n',
		'  %1 = getelementptr inbounds %struct.Value* %value, i32 0, i32 0\n',
		'  switch i64 %1, label %done [\n'
	);
	for (var i=0; i<state.records.length; i++) {
		code.push(
			'    i64 ', i, ', label %', state.records[i], '\n'
		);
	}
	code.push('  ]\n\n');
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
			code.push(
				exp.name, ':\n',
				'  switch i64 %symbol, label %', exp.name, '_done [\n'
			);
			
			for (var j=0; j<exp.fields.length; j++) {
				var sym = state.symbols[exp.fields[j].name];
				code.push(
					'    i64 ', sym, ', label %', exp.name, '_', sym, '\n'
				);
			}
			
			code.push(
				'  ]\n\n'
			);
			
			for (var j=0; j<exp.fields.length; j++) {
				var sym = state.symbols[exp.fields[j].name];
				code.push(
					exp.name, '_', sym, ':\n',
					'  br label %', exp.name, '_done\n\n'
				);
			}
			
			code.push(
				exp.name, '_done:\n',
				'  br label %done',
				'\n\n'
			);
      break;		
		}
	};
	visit(tree.block);
	code.push(
		'done:\n',
		'  ret void\n',
		'}'
	);
};
LLVMGenerator.prototype._define_functions = function(state, tree, code) {
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
LLVMGenerator.prototype._define_expression = function(state, exp, code) {
  state.expression_count = 0;
  switch(exp.type) {
  case 'assignment':
    if (exp.right.type == 'string') {

    }
    break;
  }
};
LLVMGenerator.prototype._initialize = function(tree) {};
LLVMGenerator.prototype.visit = function(state, exp, output) {
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

exports.LLVMGenerator = LLVMGenerator;