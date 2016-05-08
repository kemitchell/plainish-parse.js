module.exports = plainishParse

var COMMENT = /^ *#/
var LINE = /^( *)(- +)?(.+)$/
//           1   2     3

function plainishParse(argument) {
  return argument
    .split('\n')
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
    .reduce(
      function(context, line, index, lines) {
        console.log('%s is %j', 'context', context)
        console.log('%s is %j', 'line', line)
        var current
        if (line.indent > context.depth) {
          // TODO check for | line.indent - context.depth | > 1
          if (line.bullet) {
            current = [ ]
            context.stack.unshift(current) }
          else {
            current = { }
            context.stack.unshift(current) } }
        else {
          while (line.indent < context.depth) {
            context.depth--
            context.stack.shift() }
            current = context.stack[0] }

        console.log('%s is %j', 'current', current)

        if (line.bullet) {
          current.push(line.content) }
        else {
          var split = line.content.split(' ')
          if (split.length === 1) {
            var nextLine = lines[index + 1]
            if (nextLine) {
              var newValue = ( nextLine.bullet ? [ ] : { } )
              current[line.content] = newValue }
            else {
              throw new Error('Dangling key on line ' + line.number) } }
          else {
            var newObject = { }
            newObject[split[0]] = split[1]
            current[line.content] = newObject } }

        context.depth = line.indent
        return context },
      { depth: -1, stack: [ ] })
    .stack
    .reverse()[0] }
