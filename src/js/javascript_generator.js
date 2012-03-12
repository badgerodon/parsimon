var Generator = require('./generator').Generator;

var JavascriptGenerator = function() {
  Generator.call(this);
};
JavascriptGenerator.prototype = new Generator;
JavascriptGenerator.prototype.generate = function(tree, callback) {
  var code = [];
  try {
    this.visit(tree, code);
    callback(null, code.join(''));
  } catch(e) {
    callback(e, code.join(''));
  }
};
JavascriptGenerator.prototype.visit = function(exp, output) {
  switch(exp.type) {
  case 'program':
    this.visit(exp.block, output);
    output.push(';');
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

exports.JavascriptGenerator = JavascriptGenerator;