var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , View = require('./View')
  , _ = require('lodash')

class LogView extends View {
    constructor (screen, options) {
        super(screen)

        var self = this

        this.defaultOptionsLog = {
            parent: screen,
            width: '100%',
            height: '50%',
            border: 'line',
            tags: true,
            keys: true,
            vi: true,
            mouse: true,
            draggable: true,
            scrollback: 100,
            scrollbar: {
              ch: ' ',
              track: {
                bg: 'yellow'
              },
              style: {
                inverse: true
              }
            }
        }

        this.options = _.extend(this.defaultOptionsLog, options.log)

        this.logger = blessed.log(this.options);
          
        this.logger.key(['escape'], function(ch, key) {
            self.destroy()
        })

        this.screen = screen

        this.focus()
    }

    log (text, options) {
        this.logger.log(text)
    }

    error (text, options) {
        this.logger.log(`{#d00000-fg}${text}{/}`)
    }

    logFormat (text, options) {
        this.logger.log(text)
    }
        
    clear () {
        this.logger.clear()
    }

    focus () {
        this.logger.focus()
        this.screen.render()
    }

    destroy () {
        this.log.destroy()
        this.screen.render()
    }
}


module.exports = LogView
