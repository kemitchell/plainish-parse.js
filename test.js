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
    [ 'a', 'b' ],
    'two-element list')

  test.same(
    plainish(
      multiline(
        'a 1',
        'b 2')),
    { a: '1', b: '2' },
    'map with two strings')

  test.same(
    plainish(
      multiline(
        'x',
        '  - a',
        '  - b')),
    { x: [ 'a', 'b' ] },
    'map with two-element list')

  test.same(
    plainish(
      multiline(
        'x',
        '  a 1',
        '  b 2')),
    { x: { a: '1', b: '2' } },
    'map with two-key map')

  test.same(
    plainish(
      multiline(
        'x',
        '  - a 1',
        '  - b 2',
        '  - c')),
    { x: [ { a: '1' }, { b: '2' }, 'c' ] },
    'map with list of maps and string')

  test.same(
    plainish(
      multiline(
        'x',
        '  - a 1',
        '    b 2',
        '  - c')),
    { x: [ { a: '1', b: '2' }, 'c' ] },
    'map with list of two-key map and string')

  //test.same(
  //  plainish(
  //    multiline(
  //      'x',
  //      '    y z')),
  //  { x: 'y z' })

  test.end() })
