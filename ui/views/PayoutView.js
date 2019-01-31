var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , TextView = require('./TextView')
  , _ = require('lodash')

class PayoutView extends TextView {
    constructor (screen, options) {
        super(screen, options)

        var self = this

        self.setText(
`
What do this script?

Buttons
- Set season time - set params in blockchain to Season 1
- Manual payout 
- Start autopayout
- Immediately payout (FORCE!)

Configuration
Season:
${JSON.stringify(options.season, null, 2)}

web3:
${JSON.stringify(options.web3, null, 2)}
`)

        this.buttonSetup = blessed.button({
            parent: this.box,
            name: 'init contract',
            content: ' init contract',
            mouse: true, keys: true, shrink: true,
            right: 1,
            top: 1,
            width: 16,
            style: {
                bg: 'green',
                focus: { bg: 'yellow' },
                hover: { bg: 'white' },
            }
        })

        this.buttonManual = blessed.button({
            parent: this.box,
            name: 'manual',
//            tags: true,
//            content: '{center}manual{/center}',
            content: ' manual',
            mouse: true, keys: true, shrink: true,
            right: 1,
            top: 3,
            width: 16,
            style: {
                bg: 'green',
                focus: { bg: 'yellow' },
                hover: { bg: 'white' },
            }
        })


        this.buttonAuto = blessed.button({
            parent: this.box,
            name: 'auto',
            content: ' auto',
            mouse: true, keys: true, shrink: true,
            right: 1,
            top: 5,
            width: 16,
            style: {
                bg: 'green',
                focus: { bg: 'yellow' },
                hover: { bg: 'white' },
            }
        })

        this.buttonForce = blessed.button({
            parent: this.box,
            name: 'immediately',
            content: ' immediately',
            mouse: true, keys: true, shrink: true,
            right: 1,
            top: 7,
            width: 16,
            style: {
                bg: 'green',
                focus: { bg: 'yellow' },
                hover: { bg: 'white' },
            }
        })

        this.buttonSetup.on('press', ()=>{
            self.emit('ui', 'hipr', 'payout', 'setup-blockchain', options.season)
        })
        this.buttonManual.on('press', ()=>{
            self.emit('ui', 'hipr', 'payout', 'manual')
        })
        this.buttonAuto.on('press', ()=>{
            self.emit('ui', 'hipr', 'payout', 'auto')
        })
        this.buttonForce.on('press', ()=>{
            self.emit('ui', 'hipr', 'payout', 'force')
        })

    }

}


module.exports = PayoutView
