const
    EOS = require('eosjs')

  
class Eos {

    constructor (options) {
        this.init(options)

        this.test()
    }

    test () {
        var block = this.eos.getBlock({block_num_or_id: 1}, (err, res) => {
            console.log(err, res)
        })
        console.log(block)
    }

    init (options) {
        console.log('eos init', options)
        
        this.eos = Eos({keyProvider: options.keyProvider})
    }
}

module.exports = Eos
