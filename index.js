module.exports = plainishParse

var COMMENT = /^ *#/
var LINE = /^( *)(- +)?(.+)$/
//           1   2     3

function plainishParse(argument) {
  return argument
    // Split the argument into lines.
    .split('\n')

    // Remove comment lines and map the rest to objects with indent,
    // bullet, content, and number properties.
    .reduce(
      function(lines, line, index) {
        if (COMMENT.test(line)) {
          return lines }
        else {
          var match = LINE.exec(line)
          var bullet = match[2]
          var lineNumber = ( index + 1 )
          var indentation = match[1].length
          if (indentation % 2 !== 0) {
            throw new Error(
              'Invalid indentation on line ' +
              lineNumber ) }
          return lines.concat(
            { indent: ( indentation / 2 ),
              bullet: bullet,
              content: match[3],
              number: lineNumber }) } },
      [ ])

    // Build a nested data structure.
    .reduce(
      function(context, line, index, lines) {
        var current
        var newValue
        var split

        // Determine whether the root structure should be a list (Array)
        // or a map (Object).
        if (context.depth === -1) {
          if (line.indent === 0) {
            current = ( line.bullet ? [ ] : { } )
            context.stack.unshift(current)
            context.depth = 0 }
          else {
            throw new Error('Illegal indent on line ' + line.number) } }

        // This line is deeper than the last.
        if (line.indent > context.depth) {
          // TODO check for | line.indent - context.depth | > 1
          if (line.bullet) {
            current = [ ]
            context.stack.unshift(current) }
          else {
            current = { }
            context.stack.unshift(current) } }
        // This line is at the same or a lower depth than the last.
        else {
          while (line.indent < context.depth) {
            context.depth--
            context.stack.shift() }
            current = context.stack[0] }

        // This line has a bullet, meaning it's the start of an item in
        // a list.
        if (line.bullet) {
          split = line.content.split(' ')
          if (split.length === 1) {
            current.push(line.content)
            context.depth = line.indent }
          else {
            newValue = { }
            newValue[split[0]] = split[1]
            current.push(newValue)
            context.stack.unshift(newValue)
            context.depth = ( line.indent + 1 ) } }
        else {
          split = line.content.split(' ')
          if (split.length === 1) {
            var nextLine = lines[index + 1]
            if (nextLine && nextLine.indent === ( line.indent + 1 )) {
              newValue = ( nextLine.bullet ? [ ] : { } )
              current[line.content] = newValue
              context.stack.unshift(newValue)
              context.depth = nextLine.indent }
            else {
              throw new Error('Dangling key on line ' + line.number) } }
          else {
            current[split[0]] = split[1] } }

        return context },

      // The initial context.
      { depth: -1, stack: [ ] })

    // The stack from the context above.
    .stack

    // Reverse it...
    .reverse()

    // ...so we can pull the last element.
    [0] }
