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
  generate: function() {
    throw "Not Implemented";
  },
  raise: function(exp, msg) {
    throw new GeneratorException(exp, msg);
  }
};

exports.Generator = Generator;
exports.GeneratorException = GeneratorException;