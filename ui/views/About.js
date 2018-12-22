var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , TextView = require('./TextView')
  , _ = require('lodash')

class AboutView extends TextView {
    constructor (screen, options) {
        super(screen, options)

        var text = 'About\nHIPR.ONE'

        this.setText(text)
    }
}

module.exports = AboutView
