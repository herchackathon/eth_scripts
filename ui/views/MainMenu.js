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
            align: "left", //"center",
            mouse: true,
            keys: true,
            vi: true,
            alwaysScroll: true,
            width: "50%",
            height: 12,
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
                "(+) Deploy: build local container",
                "(+) Deploy: build local docker",
                "(+) Deploy: hipr-restful to dev-server",
                "(*) Airdrop HIPR to winners",
                "View config",
                "About",
            ]
        });

        this.table.on('select', function(node, index){
//            console.log(index)
            var s = node.content
            if (s.indexOf('(') == 0)
                s = s.substr(4)
            if (s == 'Run ganache') 
                self.emit('ui', 'run-ganache', 'run')
            else if (s == 'Deploy contracts')
                self.emit('ui', 'contracts', 'deploy')
            else if (s == 'Run hipr-restful')
                self.emit('ui', 'hipr-restful', 'run')
            else if (s == 'Run HERC')
                self.emit('ui', 'HERC', 'run')

            else if (s == 'Deploy: build local container')
                self.emit('ui', 'deploy', 'all.local.container')
            else if (s == 'Deploy: build local docker')
                self.emit('ui', 'deploy', 'all.local.docker')
            else if (s == 'Deploy: hipr-restful to dev-server')
                self.emit('ui', 'deploy', 'hipr-restful.dev-server')

            
            else if (s == 'Airdrop HIPR to winners')
                self.emit('ui', 'herc', 'airdrop')

            else if (s == 'View config')
                self.emit('ui', 'Config', 'show')
            else if (s == 'About')
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
