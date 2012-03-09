start
  = program

program
  = es:expression* space* {
    return {
      'type': 'program',
      'expressions': es
    };
  }

expression
  = binary_expression

binary_expression
  = left:post_expression space* op:(
      "==" / "!=" / "=" / "+"
      / "*" / "-" / "/" / "%"
      / "&&" / "&" / "||" / "|"
      / '<=' / '<' / '>=' / '>'
    ) space* right:binary_expression {
      return {
        'type': 'binary',
        'left': left,
        'right': right,
        'op': op
      }
    }
  / post_expression

post_expression
  = left:fundamental_expression tail:post_expression_tail+ {
      var e = tail[0];
      e.left = left;
      for (var i=1; i<tail.length; i++) {
        tail[i].left = e;
        e = tail[i];
      }
      return e;
    }
  / fundamental_expression

post_expression_tail
  = '(' space* es:parameters? ')' space* {
      return {
        'type': 'invocation',
        'parameters': es
      };
    }
  / '.' e:reference {
      return {
        'type': 'member',
        'right': e
      };
    }
  / ':' e:reference {
      return {
        'type': 'class_member',
        'right': e
      }
    }
  / '[' space* es:parameters? ']' space* {
      return {
        'type': 'index',
        'parameters': es
      }
    }

fundamental_expression
  = record_definition
  / function_definition
  / return_expression
  / while_expression
  / if_expression
  / constructor
  / reference
  / numeric_literal
  / string_literal

record_definition
  = "record" space+ "{" space* fs:record_definition_fields? "}" space* {
    return {
      'type': 'record_definition',
      'fields': fs
    };
  }
record_definition_fields
  = f:record_definition_field space* fs:(("," space* f:record_definition_field) { return f; })* {
    var arr = [];
    arr.push(f);
    arr.push.apply(arr, fs);
    return arr;
  }
record_definition_field
  = name:variable_identifier type:((space+ t:type_identifier) { return t; })? space* {
    return {
      'type': 'record_definition_field',
      'name': name,
      'type': type
    };
  }

function_definition
  = "func" space* "(" space* ps:function_definition_parameters? ")" space* "{" space* es:expression* "}" space* {
    return {
      'type': 'function_definition',
      'parameters': ps,
      'body': es
    };
  }
function_definition_parameters
  = p:function_definition_parameter space* ps:(("," space* p:function_definition_parameter) { return p; })* {
    var arr = [];
    arr.push(p);
    arr.push.apply(arr, ps);
    return arr;
  }
function_definition_parameter
  = name:variable_identifier type:((space+ t:type_identifier) { return t; })? space* {
    return {
      'type': 'function_definition_parameter',
      'name': name,
      'type': type
    };
  }

return_expression
  = "return" space+ exp:expression space* {
    return {
      'type': 'return',
      'expression': exp
    }
  }

while_expression
  = "while" space+ e:expression space* '{' space* es:expression* '}' space* {
    return {
      'type': 'while',
      'condition': e,
      'body': es
    };
  }

if_expression
  = "if" space+ c:expression space* '{' space* es:expression* '}' space*
    alt:if_expression_alternatives* space*
    rest:(("else" space* '{' space* else_es:expression* '}') { return else_es; })? space* {
    return {
      'type': 'if',
      'condition': c,
      'body': es,
      'alternatives': alt,
      'else': rest
    };
  }
if_expression_alternatives
  = "elseif" space+ c:expression space* '{' space* es:expression* '}' space* {
    return {
      'type': 'elseif',
      'condition': c,
      'body': es
    }
  }

constructor
  = type:type_identifier space* '{' space* es:parameters? '}' space* {
    return {
      'type': 'constructor',
      'name': type,
      'arguments': es
    };
  }

parameters
  = e:expression space* es:((',' space* e:expression space*) { return e; })* {
    var arr = [];
    arr.push(e);
    arr.push.apply(arr, es);
    return arr;
  }

reference = e:(variable_identifier / type_identifier) space* { return e; }

numeric_literal = ds:[0-9]+ space* {
    return {
      'type': 'integer',
      'value': parseInt(ds.join(''), 10)
    };
  }

string_literal = '"' str:[^"]* '"' {
    return {
      'type': 'string',
      'value': str.join("")
    };
  }

variable_identifier
  = l:[a-z] ls:[a-zA-Z_0-9]* { return l + ls.join(""); }

type_identifier
  = ps:'^'* l:[A-Z] ls:[a-zA-Z_0-9]* { return ps.join("") + l + ls.join(""); }

space
  = [\n\r\t ]
