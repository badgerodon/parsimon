var Locator = function(name, contents, pos) {
  this.name = name;
  this.contents = contents;
  this.pos = pos;
};
Locator.prototype = {
  toString: function() {
    var pos = this.pos;
    var p0 = pos;
    var p1 = pos;
    var ln = 1;

    for (var i=0; i<pos; i++) {
      if (this.contents.substr(i, 2) == '\r\n') {
        i++;
        ln++;
      } else if (this.contents.substr(i, 1) == '\r' || this.contents.substr(i, 1) == '\n') {
        ln++;
      }
    }

    while (p0 >= 0) {
      if (this.contents.substr(p0, 1) == '\r' || this.contents.substr(p0, 1) == '\n') {
        p0++;
        break;
      }
      p0--;
    }
    while (p1 < this.contents.length) {
      if (this.contents.substr(p1, 1) == '\r' || this.contents.substr(p1, 1) == '\n') {
        break;
      }
      p1++;
    }

    var line = this.contents.substr(p0, p1-p0);
    var prefix = this.contents.substr(p0, pos - p0).replace(/./g, ' ');

    return [
      this.name + ': ' + ln,
      line,
      prefix + "^",
      ""
    ].join('\n')
  }
};

exports.Locator = Locator;