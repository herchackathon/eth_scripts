var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , View = require('./View')

class DeployContracts extends View {
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
                "local-ganache",
                "ropsten",
                "main",
            ]
        });

        this.table.on('select', function(node, index){
            console.log(index)
            if (node.content == 'local-ganache') 
                self.emit('ui', 'contracts.deploy', 'ganache')
            else if (node.content == 'ropsten')
                self.emit('ui', 'contracts.deploy', 'ropsten')
            else if (node.content == 'main')
                self.emit('ui', 'contracts.deploy', 'main')
        })
          
        this.table.append(new blessed.Text({  
            left: 2,
            top:-1,
            content: ' {#efff00-fg}Deploy contracts{/} ',
            tags: true,
        }));

        function esc (ch, key) {
            self.emit('ui', 'contracts.deploy', 'hide')
        }

/*        var f = screen.key(['escape'], function(ch, key) {
            self.emit('ui', 'contracts.deploy', 'hide')
        });*/
        this.bind(['escape'], function(ch, key) {
            self.emit('ui', 'contracts.deploy', 'hide')
        })

        screen.render()
    }

    focus () {
        this.table.focus()
    }

    destroy () {
        this.table.destroy()
        super.destroy()
    }
}

module.exports = DeployContracts
