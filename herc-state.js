var fs = require('fs')

class HERCState {

    constructor () {
        this.file = 'herc.state.json'
        this.state = this.defaultState()
    }

    defaultState () {
        var state = {
            mainIndex: -1,
            network: -1,
            networks: [
                {
                    eth: 'ganache-local',
                    owner: '0x$GANACHE',
                },
                {
                    eth: 'ropsten-dev-gojo',
                    owner: '0x',
                },
                {
                    eth: 'main-dev-gojo',
                    owner: '0x',
                },
                {
                    eth: 'ropsten-dev-manu',
                    owner: '0x',
                },
                {
                    eth: 'ropsten-dev-fujin',
                    owner: '0x',
                },
                {
                    eth: 'main-prod-fujin',
                    owner: '0x',
                },
            ]
        }
        return state
    }

    get () {
        return this.state
    }

    load (file) {
        file = file || this.file
        try {
                var data = fs.readFileSync(file)
                if (data) {
                    this.state = JSON.parse(data)
                    console.log(`config: loaded ${file}`)
                }
            }
            catch (e) {
                console.log(`config: load error ${file} ${e.message}`)
            }
        
            this.update()
    }

    save (file) {
        file = file || this.file
        if (state) {
            state.updated = new Date()

            fs.writeFileSync(file, JSON.stringify(config, null, 2))

            console.log(`config: save success ${file}`)
          
            systemUpdate()
        }
        else {
            console.log(`config: load error ${file}`)
        }
    }

    update () {
        console.log(`config: update ${this.file}`)
    }
}

module.exports = HERCState
