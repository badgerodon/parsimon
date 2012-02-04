require 'rubygems'
require 'treetop'
require 'parsimon_node_classes'
require 'pp'

Treetop.load "parsimon"

s1 = "
record Node { left ^Node, right ^Node, key, value }

main = 0
"
s2 = "
main = func() {
  x = \"TEST\".a.b.c.d.e.f.g.h
	ret 0
}
"

parser = ParsimonParser.new
result = parser.parse(s2)
if result
	puts result.compile
else
	p parser.failure_reason
	p "#{parser.failure_line}, #{parser.failure_column}"
end