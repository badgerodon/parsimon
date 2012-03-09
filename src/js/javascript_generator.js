var JavascriptGenerator = function() {
  Generator.call(this);
};
JavascriptGenerator.prototype = new require('./generator').Generator;
JavascriptGenerator.prototype.generate = function(tree, callback) {
  callback('Not Implemented', null);
};

exports.JavascriptGenerator = JavascriptGenerator;