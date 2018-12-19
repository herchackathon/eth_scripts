var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , View = require('./View')

class MainMenu extends View {
    constructor (screen, options) {
        super(screen)

        var self = this

        this.table = blessed.list({
            parent: screen,
            draggable: true,
            align: "center",
            mouse: true,
            keys: true,
            vi: true,
            alwaysScroll: true,
            width: "50%",
            height: 8,
            top: 0,
            right: 0,
//            left: "center",
            fg: 'blue',
            border: {
              type: 'line'
            },
            selectedBg: 'green',
            items: [
                "(+) Deploy contracts",
                "(+) Run ganache",
                "(-) Run: hipr-restful local dev",
                "(-) Run: HERC local dev",
                "(T) Deploy: build local container",
                "(T) Deploy: build local docker",
                "(.) Deploy: hipr-restful to dev-server",
                "About",
            ]
        });

        this.table.on('select', function(node, index){
//            console.log(index)
            if (node.content == '+ Run ganache') 
                self.emit('ui', 'run-ganache', 'run')
            if (node.content == '+ Deploy contracts')
                self.emit('ui', 'contracts', 'deploy')
            else if (node.content == '- Run hipr-restful')
                self.emit('ui', 'hipr-restful', 'run')
            else if (node.content == '- Run HERC')
                self.emit('ui', 'HERC', 'run')
            else if (node.content == '. Deploy hipr-restful to server')
                self.emit('ui', 'hipr-restful', 'deploy')
            else if (node.content == '+ About')
                self.emit('ui', 'About', 'show')
        })
          
        this.table.append(new blessed.Text({  
            left: 2,
            top:-1,
            content: ' {#efff00-fg}HERC.ONE{/} ',
            tags: true,
        }));
          
        screen.render()
    }

    focus () {
        this.table.focus()
    }
}

module.exports = MainMenu
