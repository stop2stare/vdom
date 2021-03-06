var diff = require('../src/diff')
var h = require('../src/h')
var assert = require('assert')
var types = require('../src/types')

describe('test diff', function() {
  it('should handle dom replacing', function() {
    var tree0 = h('i')
    var tree1 = h('em')

    var patches = diff(tree0, tree1)
    assert.deepEqual(patches, {
      0: [{
        type: types.REPLACE,
        patch: h('em')
      }]
    })
  })

  it('should handle props changes', function() {
    var tree0 = h('i', {
      class: 'foo',
      name: 'i',
      id: 'foo'
    })
    var tree1 = h('i', {
      class: 'bar',
      name: 'i',
      baz: 1
    })

    var patches = diff(tree0, tree1)
    assert.deepEqual(patches, {
      0: [{
        type: types.PROPS,
        patch: {
          class: 'bar',
          id: undefined,
          baz: 1
        }
      }]
    })
  })

  it('should handle elements deleted', function() {
    var tree0 = h('div', {}, [h('span')])
    var tree1 = h('div', {})

    var patches = diff(tree0, tree1)
    assert.deepEqual(patches, {
      0: [{
        type: types.REORDER,
        patch: {
          moves: [{
            index: 0,
            type: 0
          }]
        }
      }]
    })
  })

  it('should handle text node changed', function() {
    var tree0 = 'p1'
    var tree1 = 'p2'

    var patches = diff(tree0, tree1)
    assert.deepEqual(patches, {
      0: [{
        type: types.TEXT,
        patch: 'p2'
      }]
    })
  })

  it('should handle children changed', function() {
    var tree0 = h('ul', {}, [
      h('li', { key: 0 }),
      h('li', { key: 1 }),
      h('li', { key: 2 })
    ])
    var tree1 = h('ul', {}, [
      h('li', { key: 1, name: 'aa' })
    ])

    var patches = diff(tree0, tree1)
    assert.deepEqual(patches, {
      0: [{
        type: types.REORDER,
        patch: {
          moves: [
            { index: 0, type: 0 },
            { index: 1, type: 0 }
          ]
        }
      }],
      2: [{
        type: types.PROPS,
        patch: { name: 'aa' }
      }]
    })
  })
})
