var EventEmitter = require('events')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , _ = require('lodash')

class View extends EventEmitter {
    constructor (screen) {
        super()
        this.screen = screen
        this.keys = {}
    }

    destroy () {
        for (var k in this.keys) {
            this.screen.unkey(k, this.keys[k])
        }
        this.screen.render()
    }

    bind (key, fn) {
        this.keys[key] = fn
        this.screen.key(key, fn)
    }

}

module.exports = View
