
$0$Tree$new = function() {
  return [null, 0];
};
$0$Tree$get = function($this, $key) {
  var $node = $this[0];
  while($node !== null) {
    if ($node[2] === $key) {
      return $node[3];
    } else if ($node[2] < $key) {
      return $node[0];
    } else {
      return $node[1];
    }
  }
  return null;
};
$0$Tree$set = function($this, $key, $value) {
  if ($this[1] === 0) {
    $this[0] = [null, null, $key, $value];
    $this[1] = 1;
  } else {

  }
};

$0$t = $0$Tree$new();
$0 = "key";
$1 = 5;
$0$Tree$set($0$t, $0, $1);
$0 = "key";
$0$Tree$get($0);

delete $0$t;
delete $0$Tree$set;
delete $0$Tree$get;
delete $0$Tree$new;

delete $0;
delete $1;