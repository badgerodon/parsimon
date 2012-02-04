module Parsimon
	class Environment
		def initialize
			@stack = {}
		end
		def peek(sym)
			(@stack[sym] || []).last
		end
		def push(sym, val)
			@stack[sym] ||= []
			@stack[sym].push(val)
		end
		def pop(sym)
			(@stack[sym] || []).pop()
		end
	end

	class Program < Treetop::Runtime::SyntaxNode
		@block = nil
		def compile
			env = Environment.new
			walk(env)
			src = []
			src << "%Primitive.Integer = type i64"
			src << "%Primitive.Float = type double"
			src << "%Primitive.Boolean = type i1"
			src << "%Primitive.Value = type { i32, i32, i8* }"
			pp @block
			#env[:record_definitions].map do |name, fields|
			#	src << "%Record.#{name} = type { " +
			#		fields.map do |f|
			#			ptr = ""
			#			t = f[:type]
			#			while t[0, 1] == '^'
			#				ptr += '*'
			#				t = t[1, t.size-1]
			#			end
			#			if env[:record_definitions][t]
			#				"%Record.#{t}#{ptr}"
			#			else
			#				"%Primitive.#{t}#{ptr}"
			#			end
			#		end.join(', ') +
			#		' } '
			#end
			src << "
@.str = private unnamed_addr constant [4 x i8] c\"%d\\0A\\00\", align 1
declare i32 @printf(i8*, ...)
define i32 @main() {
	%x = alloca %Record.Node

	%v = alloca %Primitive.Value
	%vp_type = getelementptr %Primitive.Value* %v, i32 0, i32 0
	%vp_value = getelementptr %Primitive.Value* %v, i32 0, i32 2
	%i = alloca i32
	store i32 1, i32* %i
	%ip = bitcast i32* %i to i8*
	store i8* %ip, i8** %vp_value

  %1 = alloca i32
  store i32 32, i32* %1
  %2 = load i32* %1
	call i32 (i8*, ...)* @printf(i8* getelementptr ([4 x i8]* @.str, i32 0, i32 0), i32 %2)
	ret i32 0
}
			"
			src.join("\n")
		end
		def walk(env)
			walker = lambda do |e|
				if e.respond_to?(:before)
					e.before(env)
				end
				if e.elements
					e.elements.each do |c|
						walker.call(c)
					end
				end
				if e.respond_to?(:after)
					e.after(env)
				end
			end
			walker.call(self)
		end
	end
end