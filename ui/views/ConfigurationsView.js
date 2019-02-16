var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , View = require('./View')

class Configurations extends View {
    constructor (screen, options) {
        super(screen)

        var self = this

        this.screen = screen
        this.options = options
        this.configurations = options.configurations

        var menu = []

        for (var c in this.configurations) {
            menu.push(JSON.stringify(this.configurations[c]))
        }

        this.table = blessed.list({
            parent: screen,
            draggable: true,
            align: "left", //"center",
            mouse: true,
            keys: true,
            vi: true,
            alwaysScroll: true,
            width: "100%",
            height: 12,
            top: 0,
//            right: 0,
            left: "center",
            fg: 'blue',
            border: {
              type: 'line'
            },
            selectedBg: 'green',
            items: menu
        });

        this.table.on('select', function(node, index){
            var configuration

            self.index = index

            var conf = self.configurations[index]


            self.destroy()

            self.emit('ui', 'config', 'select-item', index)

        })
          
        this.table.append(new blessed.Text({  
            left: 2,
            top:-1,
            content: ' {#efff00-fg}Configurations{/} ',
            tags: true,
        }));
          
        this.bind(['escape'], function(ch, key) {
            self.emit('ui', 'config', 'hide')
        })

        screen.render()
    }

    focus () {
        this.table.focus()
    }

    destroy () {
        this.table.destroy()
        this.screen.render()
    }
}

module.exports = Configurations
