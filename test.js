var tape = require('tape')
var plainish = require('./')

tape('plainish', function(test) {

  function multiline() {
    return Array.prototype.slice.call(arguments).join('\n') }

  test.same(
    plainish(
      multiline(
        '- a',
        '- b')),
    [ 'a', 'b' ])

  test.same(
    plainish(
      multiline(
        'x',
        '  - a',
        '  - b')),
    { x: [ 'a', 'b' ] })

  test.same(
    plainish(
      multiline(
        'x',
        '  a 1',
        '  b 2')),
    { x: { a: '1', b: '2' } })

  test.same(
    plainish(
      multiline(
        'x',
        '  - a 1',
        '  - b 2',
        '  - c')),
    { x: [ { a: '1' }, { b: '1' }, 'c' ] })

  test.same(
    plainish(
      multiline(
        'x',
        '  - a 1',
        '    b 2',
        '  - c')),
    { x: [ { a: '1', b: '1' }, 'c' ] })


  test.same(
    plainish(
      multiline(
        'x',
        '    y z')),
    { x: 'y z' })

  test.end() })
