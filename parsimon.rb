# Autogenerated from a Treetop grammar. Edits may be lost.


module Parsimon
  include Treetop::Runtime

  def root
    @root ||= :program
  end

  module Program0
  end

  module Program1
  end

  module Program2
    def before(env)
      env.push(:expressions, [])
    end
    def after(env)
      @expressions = env.pop(:expressions)
    end
  end

  def _nt_program
    start_index = index
    if node_cache[:program].has_key?(index)
      cached = node_cache[:program][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    i1 = index
    i2, s2 = index, []
    s3, i3 = [], index
    loop do
      r4 = _nt_space
      if r4
        s3 << r4
      else
        break
      end
    end
    if s3.empty?
      @index = i3
      r3 = nil
    else
      r3 = instantiate_node(SyntaxNode,input, i3...index, s3)
    end
    s2 << r3
    if r3
      s5, i5 = [], index
      loop do
        r6 = _nt_expression
        if r6
          s5 << r6
        else
          break
        end
      end
      r5 = instantiate_node(SyntaxNode,input, i5...index, s5)
      s2 << r5
    end
    if s2.last
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      r2.extend(Program0)
    else
      @index = i2
      r2 = nil
    end
    if r2
      r1 = r2
    else
      s7, i7 = [], index
      loop do
        r8 = _nt_expression
        if r8
          s7 << r8
        else
          break
        end
      end
      r7 = instantiate_node(SyntaxNode,input, i7...index, s7)
      if r7
        r1 = r7
      else
        @index = i1
        r1 = nil
      end
    end
    s0 << r1
    if r1
      s9, i9 = [], index
      loop do
        r10 = _nt_space
        if r10
          s9 << r10
        else
          break
        end
      end
      r9 = instantiate_node(SyntaxNode,input, i9...index, s9)
      s0 << r9
    end
    if s0.last
      r0 = instantiate_node(Program,input, i0...index, s0)
      r0.extend(Program1)
      r0.extend(Program2)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:program][start_index] = r0

    r0
  end

  module Expression0
    def exp1
      elements[0]
    end

  end

  def _nt_expression
    start_index = index
    if node_cache[:expression].has_key?(index)
      cached = node_cache[:expression][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    r1 = _nt_exp1
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        r3 = _nt_space
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(Expression0)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:expression][start_index] = r0

    r0
  end

  def _nt_exp1
    start_index = index
    if node_cache[:exp1].has_key?(index)
      cached = node_cache[:exp1][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0 = index
    r1 = _nt_binary
    if r1
      r0 = r1
    else
      r2 = _nt_exp2
      if r2
        r0 = r2
      else
        @index = i0
        r0 = nil
      end
    end

    node_cache[:exp1][start_index] = r0

    r0
  end

  def _nt_exp2
    start_index = index
    if node_cache[:exp2].has_key?(index)
      cached = node_cache[:exp2][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0 = index
    r1 = _nt_record_declaration
    if r1
      r0 = r1
    else
      r2 = _nt_function_declaration
      if r2
        r0 = r2
      else
        r3 = _nt_string_literal
        if r3
          r0 = r3
        else
          r4 = _nt_numeric_literal
          if r4
            r0 = r4
          else
            r5 = _nt_parentheses
            if r5
              r0 = r5
            else
              r6 = _nt_reference
              if r6
                r0 = r6
              else
                @index = i0
                r0 = nil
              end
            end
          end
        end
      end
    end

    node_cache[:exp2][start_index] = r0

    r0
  end

  module Binary0
    def exp2
      elements[0]
    end

    def expression
      elements[4]
    end
  end

  module Binary1
    def before(env)
      env.push(:expressions, [])
    end
    def after(env)
      left, right = env.pop(:expressions)
      env.peek(:expressions) << {
        :type => :binary,
        :operator => elements.drop(1).select { |e| e.text_value.strip() != '' }.first.text_value,
        :left => left,
        :right => right
      }
    end
  end

  def _nt_binary
    start_index = index
    if node_cache[:binary].has_key?(index)
      cached = node_cache[:binary][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    r1 = _nt_exp2
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        r3 = _nt_space
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
      if r2
        i4 = index
        if has_terminal?('==', false, index)
          r5 = instantiate_node(SyntaxNode,input, index...(index + 2))
          @index += 2
        else
          terminal_parse_failure('==')
          r5 = nil
        end
        if r5
          r4 = r5
        else
          if has_terminal?('!=', false, index)
            r6 = instantiate_node(SyntaxNode,input, index...(index + 2))
            @index += 2
          else
            terminal_parse_failure('!=')
            r6 = nil
          end
          if r6
            r4 = r6
          else
            if has_terminal?('=', false, index)
              r7 = instantiate_node(SyntaxNode,input, index...(index + 1))
              @index += 1
            else
              terminal_parse_failure('=')
              r7 = nil
            end
            if r7
              r4 = r7
            else
              if has_terminal?('+', false, index)
                r8 = instantiate_node(SyntaxNode,input, index...(index + 1))
                @index += 1
              else
                terminal_parse_failure('+')
                r8 = nil
              end
              if r8
                r4 = r8
              else
                if has_terminal?('*', false, index)
                  r9 = instantiate_node(SyntaxNode,input, index...(index + 1))
                  @index += 1
                else
                  terminal_parse_failure('*')
                  r9 = nil
                end
                if r9
                  r4 = r9
                else
                  if has_terminal?('-', false, index)
                    r10 = instantiate_node(SyntaxNode,input, index...(index + 1))
                    @index += 1
                  else
                    terminal_parse_failure('-')
                    r10 = nil
                  end
                  if r10
                    r4 = r10
                  else
                    if has_terminal?('/', false, index)
                      r11 = instantiate_node(SyntaxNode,input, index...(index + 1))
                      @index += 1
                    else
                      terminal_parse_failure('/')
                      r11 = nil
                    end
                    if r11
                      r4 = r11
                    else
                      if has_terminal?('%', false, index)
                        r12 = instantiate_node(SyntaxNode,input, index...(index + 1))
                        @index += 1
                      else
                        terminal_parse_failure('%')
                        r12 = nil
                      end
                      if r12
                        r4 = r12
                      else
                        if has_terminal?('&&', false, index)
                          r13 = instantiate_node(SyntaxNode,input, index...(index + 2))
                          @index += 2
                        else
                          terminal_parse_failure('&&')
                          r13 = nil
                        end
                        if r13
                          r4 = r13
                        else
                          if has_terminal?('&', false, index)
                            r14 = instantiate_node(SyntaxNode,input, index...(index + 1))
                            @index += 1
                          else
                            terminal_parse_failure('&')
                            r14 = nil
                          end
                          if r14
                            r4 = r14
                          else
                            if has_terminal?('||', false, index)
                              r15 = instantiate_node(SyntaxNode,input, index...(index + 2))
                              @index += 2
                            else
                              terminal_parse_failure('||')
                              r15 = nil
                            end
                            if r15
                              r4 = r15
                            else
                              if has_terminal?('|', false, index)
                                r16 = instantiate_node(SyntaxNode,input, index...(index + 1))
                                @index += 1
                              else
                                terminal_parse_failure('|')
                                r16 = nil
                              end
                              if r16
                                r4 = r16
                              else
                                @index = i4
                                r4 = nil
                              end
                            end
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
        s0 << r4
        if r4
          s17, i17 = [], index
          loop do
            r18 = _nt_space
            if r18
              s17 << r18
            else
              break
            end
          end
          r17 = instantiate_node(SyntaxNode,input, i17...index, s17)
          s0 << r17
          if r17
            r19 = _nt_expression
            s0 << r19
          end
        end
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(Binary0)
      r0.extend(Binary1)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:binary][start_index] = r0

    r0
  end

  module RecordDeclaration0
    def record_field
      elements[2]
    end

  end

  module RecordDeclaration1
    def record_field
      elements[0]
    end

  end

  module RecordDeclaration2
  end

  module RecordDeclaration3
    def before(env)
      env.push(:fields, [])
    end
    def after(env)
      fields = env.pop(:fields)
      env.peek(:expressions) << {
        :type => :record_declaration,
        :fields => fields
      }
    end
  end

  def _nt_record_declaration
    start_index = index
    if node_cache[:record_declaration].has_key?(index)
      cached = node_cache[:record_declaration][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    if has_terminal?("record", false, index)
      r1 = instantiate_node(SyntaxNode,input, index...(index + 6))
      @index += 6
    else
      terminal_parse_failure("record")
      r1 = nil
    end
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        r3 = _nt_space
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
      if r2
        if has_terminal?('{', false, index)
          r4 = instantiate_node(SyntaxNode,input, index...(index + 1))
          @index += 1
        else
          terminal_parse_failure('{')
          r4 = nil
        end
        s0 << r4
        if r4
          s5, i5 = [], index
          loop do
            r6 = _nt_space
            if r6
              s5 << r6
            else
              break
            end
          end
          r5 = instantiate_node(SyntaxNode,input, i5...index, s5)
          s0 << r5
          if r5
            i8, s8 = index, []
            r9 = _nt_record_field
            s8 << r9
            if r9
              s10, i10 = [], index
              loop do
                r11 = _nt_space
                if r11
                  s10 << r11
                else
                  break
                end
              end
              r10 = instantiate_node(SyntaxNode,input, i10...index, s10)
              s8 << r10
              if r10
                s12, i12 = [], index
                loop do
                  i13, s13 = index, []
                  if has_terminal?(',', false, index)
                    r14 = instantiate_node(SyntaxNode,input, index...(index + 1))
                    @index += 1
                  else
                    terminal_parse_failure(',')
                    r14 = nil
                  end
                  s13 << r14
                  if r14
                    s15, i15 = [], index
                    loop do
                      r16 = _nt_space
                      if r16
                        s15 << r16
                      else
                        break
                      end
                    end
                    r15 = instantiate_node(SyntaxNode,input, i15...index, s15)
                    s13 << r15
                    if r15
                      r17 = _nt_record_field
                      s13 << r17
                      if r17
                        s18, i18 = [], index
                        loop do
                          r19 = _nt_space
                          if r19
                            s18 << r19
                          else
                            break
                          end
                        end
                        r18 = instantiate_node(SyntaxNode,input, i18...index, s18)
                        s13 << r18
                      end
                    end
                  end
                  if s13.last
                    r13 = instantiate_node(SyntaxNode,input, i13...index, s13)
                    r13.extend(RecordDeclaration0)
                  else
                    @index = i13
                    r13 = nil
                  end
                  if r13
                    s12 << r13
                  else
                    break
                  end
                end
                r12 = instantiate_node(SyntaxNode,input, i12...index, s12)
                s8 << r12
              end
            end
            if s8.last
              r8 = instantiate_node(SyntaxNode,input, i8...index, s8)
              r8.extend(RecordDeclaration1)
            else
              @index = i8
              r8 = nil
            end
            if r8
              r7 = r8
            else
              r7 = instantiate_node(SyntaxNode,input, index...index)
            end
            s0 << r7
            if r7
              if has_terminal?('}', false, index)
                r20 = instantiate_node(SyntaxNode,input, index...(index + 1))
                @index += 1
              else
                terminal_parse_failure('}')
                r20 = nil
              end
              s0 << r20
            end
          end
        end
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(RecordDeclaration2)
      r0.extend(RecordDeclaration3)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:record_declaration][start_index] = r0

    r0
  end

  module RecordField0
    def type_identifier
      elements[1]
    end
  end

  module RecordField1
    def variable_identifier
      elements[0]
    end

  end

  module RecordField2
    def after(env)
      env.peek(:fields) << {
        :name => elements.first.text_value,
        :type => if elements.size > 1 && elements.last.elements
          elements.last.elements.last.text_value
        else
          nil
        end
      }
    end
  end

  def _nt_record_field
    start_index = index
    if node_cache[:record_field].has_key?(index)
      cached = node_cache[:record_field][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    r1 = _nt_variable_identifier
    s0 << r1
    if r1
      i3, s3 = index, []
      s4, i4 = [], index
      loop do
        r5 = _nt_space
        if r5
          s4 << r5
        else
          break
        end
      end
      r4 = instantiate_node(SyntaxNode,input, i4...index, s4)
      s3 << r4
      if r4
        r6 = _nt_type_identifier
        s3 << r6
      end
      if s3.last
        r3 = instantiate_node(SyntaxNode,input, i3...index, s3)
        r3.extend(RecordField0)
      else
        @index = i3
        r3 = nil
      end
      if r3
        r2 = r3
      else
        r2 = instantiate_node(SyntaxNode,input, index...index)
      end
      s0 << r2
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(RecordField1)
      r0.extend(RecordField2)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:record_field][start_index] = r0

    r0
  end

  module FunctionDeclaration0
    def function_body
      elements[10]
    end

  end

  module FunctionDeclaration1
    def before(env)
      env.push(:expressions, [])
    end
    def after(env)
      exps = env.pop(:expressions)
      pp exps
      env.peek(:expressions) << {
        :type => :function_declaration,
        :parameters => exps.size == 1 ? [] : exps[0],
        :body => exps.size == 1 ? exps[0] : exps[1]
      }
    end
  end

  def _nt_function_declaration
    start_index = index
    if node_cache[:function_declaration].has_key?(index)
      cached = node_cache[:function_declaration][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    if has_terminal?("func", false, index)
      r1 = instantiate_node(SyntaxNode,input, index...(index + 4))
      @index += 4
    else
      terminal_parse_failure("func")
      r1 = nil
    end
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        r3 = _nt_space
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
      if r2
        if has_terminal?('(', false, index)
          r4 = instantiate_node(SyntaxNode,input, index...(index + 1))
          @index += 1
        else
          terminal_parse_failure('(')
          r4 = nil
        end
        s0 << r4
        if r4
          s5, i5 = [], index
          loop do
            r6 = _nt_space
            if r6
              s5 << r6
            else
              break
            end
          end
          r5 = instantiate_node(SyntaxNode,input, i5...index, s5)
          s0 << r5
          if r5
            r8 = _nt_function_parameters
            if r8
              r7 = r8
            else
              r7 = instantiate_node(SyntaxNode,input, index...index)
            end
            s0 << r7
            if r7
              s9, i9 = [], index
              loop do
                r10 = _nt_space
                if r10
                  s9 << r10
                else
                  break
                end
              end
              r9 = instantiate_node(SyntaxNode,input, i9...index, s9)
              s0 << r9
              if r9
                if has_terminal?(')', false, index)
                  r11 = instantiate_node(SyntaxNode,input, index...(index + 1))
                  @index += 1
                else
                  terminal_parse_failure(')')
                  r11 = nil
                end
                s0 << r11
                if r11
                  s12, i12 = [], index
                  loop do
                    r13 = _nt_space
                    if r13
                      s12 << r13
                    else
                      break
                    end
                  end
                  r12 = instantiate_node(SyntaxNode,input, i12...index, s12)
                  s0 << r12
                  if r12
                    if has_terminal?('{', false, index)
                      r14 = instantiate_node(SyntaxNode,input, index...(index + 1))
                      @index += 1
                    else
                      terminal_parse_failure('{')
                      r14 = nil
                    end
                    s0 << r14
                    if r14
                      s15, i15 = [], index
                      loop do
                        r16 = _nt_space
                        if r16
                          s15 << r16
                        else
                          break
                        end
                      end
                      r15 = instantiate_node(SyntaxNode,input, i15...index, s15)
                      s0 << r15
                      if r15
                        r17 = _nt_function_body
                        s0 << r17
                        if r17
                          if has_terminal?('}', false, index)
                            r18 = instantiate_node(SyntaxNode,input, index...(index + 1))
                            @index += 1
                          else
                            terminal_parse_failure('}')
                            r18 = nil
                          end
                          s0 << r18
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(FunctionDeclaration0)
      r0.extend(FunctionDeclaration1)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:function_declaration][start_index] = r0

    r0
  end

  module FunctionParameters0
    def reference
      elements[2]
    end
  end

  module FunctionParameters1
    def reference
      elements[0]
    end

  end

  module FunctionParameters2
    def before(env)
      env.push(:expressions, [])
    end
    def after(env)
      exps = env.pop(:expressions)
      pp exps
      env.peek(:expressions) << {
        :type => :function_parameters,
        :expressions => exps
      }
    end
  end

  def _nt_function_parameters
    start_index = index
    if node_cache[:function_parameters].has_key?(index)
      cached = node_cache[:function_parameters][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    r1 = _nt_reference
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        r3 = _nt_space
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
      if r2
        s4, i4 = [], index
        loop do
          i5, s5 = index, []
          if has_terminal?(',', false, index)
            r6 = instantiate_node(SyntaxNode,input, index...(index + 1))
            @index += 1
          else
            terminal_parse_failure(',')
            r6 = nil
          end
          s5 << r6
          if r6
            s7, i7 = [], index
            loop do
              r8 = _nt_space
              if r8
                s7 << r8
              else
                break
              end
            end
            r7 = instantiate_node(SyntaxNode,input, i7...index, s7)
            s5 << r7
            if r7
              r9 = _nt_reference
              s5 << r9
            end
          end
          if s5.last
            r5 = instantiate_node(SyntaxNode,input, i5...index, s5)
            r5.extend(FunctionParameters0)
          else
            @index = i5
            r5 = nil
          end
          if r5
            s4 << r5
          else
            break
          end
        end
        r4 = instantiate_node(SyntaxNode,input, i4...index, s4)
        s0 << r4
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(FunctionParameters1)
      r0.extend(FunctionParameters2)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:function_parameters][start_index] = r0

    r0
  end

  module FunctionBody0
    def before(env)
      env.push(:expressions, [])
    end
    def after(env)
      exps = env.pop(:expressions)
      env.peek(:expressions) << {
        :type => :function_body,
        :expressions => exps
      }
    end
  end

  def _nt_function_body
    start_index = index
    if node_cache[:function_body].has_key?(index)
      cached = node_cache[:function_body][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    s0, i0 = [], index
    loop do
      r1 = _nt_expression
      if r1
        s0 << r1
      else
        break
      end
    end
    r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
    r0.extend(FunctionBody0)

    node_cache[:function_body][start_index] = r0

    r0
  end

  module NumericLiteral0
  end

  module NumericLiteral1
    def after(env)
      env.peek(:expressions) << {
        :type => :numeric_literal,
        :value => text_value
      }
    end
  end

  def _nt_numeric_literal
    start_index = index
    if node_cache[:numeric_literal].has_key?(index)
      cached = node_cache[:numeric_literal][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0 = index
    i1, s1 = index, []
    if has_terminal?('\G[1-9]', true, index)
      r2 = true
      @index += 1
    else
      r2 = nil
    end
    s1 << r2
    if r2
      s3, i3 = [], index
      loop do
        if has_terminal?('\G[0-9]', true, index)
          r4 = true
          @index += 1
        else
          r4 = nil
        end
        if r4
          s3 << r4
        else
          break
        end
      end
      r3 = instantiate_node(SyntaxNode,input, i3...index, s3)
      s1 << r3
    end
    if s1.last
      r1 = instantiate_node(SyntaxNode,input, i1...index, s1)
      r1.extend(NumericLiteral0)
    else
      @index = i1
      r1 = nil
    end
    if r1
      r0 = r1
      r0.extend(NumericLiteral1)
    else
      if has_terminal?('0', false, index)
        r5 = instantiate_node(SyntaxNode,input, index...(index + 1))
        @index += 1
      else
        terminal_parse_failure('0')
        r5 = nil
      end
      if r5
        r0 = r5
        r0.extend(NumericLiteral1)
      else
        @index = i0
        r0 = nil
      end
    end

    node_cache[:numeric_literal][start_index] = r0

    r0
  end

  module StringLiteral0
  end

  module StringLiteral1
  end

  module StringLiteral2
    def after(env)
      env.peek(:expressions) << {
        :type => :string_literal,
        :value => text_value
      }
    end
  end

  def _nt_string_literal
    start_index = index
    if node_cache[:string_literal].has_key?(index)
      cached = node_cache[:string_literal][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    if has_terminal?('"', false, index)
      r1 = instantiate_node(SyntaxNode,input, index...(index + 1))
      @index += 1
    else
      terminal_parse_failure('"')
      r1 = nil
    end
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        i3 = index
        i4, s4 = index, []
        i5 = index
        if has_terminal?('"', false, index)
          r6 = instantiate_node(SyntaxNode,input, index...(index + 1))
          @index += 1
        else
          terminal_parse_failure('"')
          r6 = nil
        end
        if r6
          r5 = nil
        else
          @index = i5
          r5 = instantiate_node(SyntaxNode,input, index...index)
        end
        s4 << r5
        if r5
          if index < input_length
            r7 = instantiate_node(SyntaxNode,input, index...(index + 1))
            @index += 1
          else
            terminal_parse_failure("any character")
            r7 = nil
          end
          s4 << r7
        end
        if s4.last
          r4 = instantiate_node(SyntaxNode,input, i4...index, s4)
          r4.extend(StringLiteral0)
        else
          @index = i4
          r4 = nil
        end
        if r4
          r3 = r4
        else
          if has_terminal?('\\"', false, index)
            r8 = instantiate_node(SyntaxNode,input, index...(index + 2))
            @index += 2
          else
            terminal_parse_failure('\\"')
            r8 = nil
          end
          if r8
            r3 = r8
          else
            @index = i3
            r3 = nil
          end
        end
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
      if r2
        if has_terminal?('"', false, index)
          r9 = instantiate_node(SyntaxNode,input, index...(index + 1))
          @index += 1
        else
          terminal_parse_failure('"')
          r9 = nil
        end
        s0 << r9
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(StringLiteral1)
      r0.extend(StringLiteral2)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:string_literal][start_index] = r0

    r0
  end

  module Parentheses0
    def expression
      elements[2]
    end

  end

  def _nt_parentheses
    start_index = index
    if node_cache[:parentheses].has_key?(index)
      cached = node_cache[:parentheses][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    if has_terminal?('(', false, index)
      r1 = instantiate_node(SyntaxNode,input, index...(index + 1))
      @index += 1
    else
      terminal_parse_failure('(')
      r1 = nil
    end
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        r3 = _nt_space
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
      if r2
        r4 = _nt_expression
        s0 << r4
        if r4
          s5, i5 = [], index
          loop do
            r6 = _nt_space
            if r6
              s5 << r6
            else
              break
            end
          end
          r5 = instantiate_node(SyntaxNode,input, i5...index, s5)
          s0 << r5
          if r5
            if has_terminal?(')', false, index)
              r7 = instantiate_node(SyntaxNode,input, index...(index + 1))
              @index += 1
            else
              terminal_parse_failure(')')
              r7 = nil
            end
            s0 << r7
          end
        end
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(Parentheses0)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:parentheses][start_index] = r0

    r0
  end

  module Reference0
    def after(env)
      env.peek(:expressions) << {
        :type => :reference,
        :value => text_value
      }
    end
  end

  def _nt_reference
    start_index = index
    if node_cache[:reference].has_key?(index)
      cached = node_cache[:reference][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    r0 = _nt_identifier
    r0.extend(Reference0)

    node_cache[:reference][start_index] = r0

    r0
  end

  def _nt_identifier
    start_index = index
    if node_cache[:identifier].has_key?(index)
      cached = node_cache[:identifier][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0 = index
    r1 = _nt_type_identifier
    if r1
      r0 = r1
    else
      r2 = _nt_variable_identifier
      if r2
        r0 = r2
      else
        @index = i0
        r0 = nil
      end
    end

    node_cache[:identifier][start_index] = r0

    r0
  end

  module TypeIdentifier0
  end

  def _nt_type_identifier
    start_index = index
    if node_cache[:type_identifier].has_key?(index)
      cached = node_cache[:type_identifier][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    s1, i1 = [], index
    loop do
      if has_terminal?('^', false, index)
        r2 = instantiate_node(SyntaxNode,input, index...(index + 1))
        @index += 1
      else
        terminal_parse_failure('^')
        r2 = nil
      end
      if r2
        s1 << r2
      else
        break
      end
    end
    r1 = instantiate_node(SyntaxNode,input, i1...index, s1)
    s0 << r1
    if r1
      if has_terminal?('\G[A-Z]', true, index)
        r3 = true
        @index += 1
      else
        r3 = nil
      end
      s0 << r3
      if r3
        s4, i4 = [], index
        loop do
          if has_terminal?('\G[a-zA-Z0-9_]', true, index)
            r5 = true
            @index += 1
          else
            r5 = nil
          end
          if r5
            s4 << r5
          else
            break
          end
        end
        r4 = instantiate_node(SyntaxNode,input, i4...index, s4)
        s0 << r4
      end
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(TypeIdentifier0)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:type_identifier][start_index] = r0

    r0
  end

  module VariableIdentifier0
  end

  def _nt_variable_identifier
    start_index = index
    if node_cache[:variable_identifier].has_key?(index)
      cached = node_cache[:variable_identifier][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    i0, s0 = index, []
    if has_terminal?('\G[a-z]', true, index)
      r1 = true
      @index += 1
    else
      r1 = nil
    end
    s0 << r1
    if r1
      s2, i2 = [], index
      loop do
        if has_terminal?('\G[a-zA-Z0-9_]', true, index)
          r3 = true
          @index += 1
        else
          r3 = nil
        end
        if r3
          s2 << r3
        else
          break
        end
      end
      r2 = instantiate_node(SyntaxNode,input, i2...index, s2)
      s0 << r2
    end
    if s0.last
      r0 = instantiate_node(SyntaxNode,input, i0...index, s0)
      r0.extend(VariableIdentifier0)
    else
      @index = i0
      r0 = nil
    end

    node_cache[:variable_identifier][start_index] = r0

    r0
  end

  def _nt_space
    start_index = index
    if node_cache[:space].has_key?(index)
      cached = node_cache[:space][index]
      if cached
        cached = SyntaxNode.new(input, index...(index + 1)) if cached == true
        @index = cached.interval.end
      end
      return cached
    end

    if has_terminal?('\G[ \\t\\n\\r]', true, index)
      r0 = instantiate_node(SyntaxNode,input, index...(index + 1))
      @index += 1
    else
      r0 = nil
    end

    node_cache[:space][start_index] = r0

    r0
  end

end

class ParsimonParser < Treetop::Runtime::CompiledParser
  include Parsimon
end
