var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , View = require('./View')
  , _ = require('lodash')

class AboutView extends View {
    constructor (screen, options) {
        super()

        var self = this

        this.defaultOptionsBox = {
            parent: screen,
//            alwaysScroll: true,
            scrollable: true,
            keys: true,
            vi: true,
            mouse: true,
            scrollbar: {
              style: {
                bg: 'yellow'
              }
            },
            top: 'center',
            left: 'center',
            width: '80%',
            height: '100%',
            draggable: true,
            content: '',
            tags: true,
            border: {
              type: 'line'
            },
            style: {
              fg: 'white', 
              bg: 'black',
              border: {
                fg: '#f0f0'
              },
/*              hover: {
                bg: 'green' 
              }*/
            }
        }

        this.options = _.extend(this.defaultOptionsBox, options.box)

        this.box = blessed.ScrollableBox(this.options)

        var text = 'About\nHIPR.ONE'

        this.box.setContent(text)

        this.box.key(['escape'], function(ch, key) {
            self.destroy()
        })

        this.screen = screen

        this.focus()
    }

    focus () {
        this.box.focus()
        this.screen.render()
    }

    destroy () {
        this.box.destroy()
        super.destroy()
    }
}

module.exports = AboutView
