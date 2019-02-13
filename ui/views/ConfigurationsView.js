var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , View = require('./View')

class Configurations extends View {
    constructor (screen, options) {
        super(screen)

        var self = this

        var configurations = options.configurations

        var menu = []

        for (var c in configurations) {
            menu.push(JSON.stringify(configurations[c]))
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
            
            self.index = index

            var configurations
            
        })
          
        this.table.append(new blessed.Text({  
            left: 2,
            top:-1,
            content: ' {#efff00-fg}Configurations{/} ',
            tags: true,
        }));
          
        screen.render()
    }

    focus () {
        this.table.focus()
    }
}

module.exports = Configurations
