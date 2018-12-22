

const fs = require('fs'),
    mkdirp = require('mkdirp'),
    shell = require('shelljs')
    blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    defaultConfig = require('./default-config.js'),
    path = require('path')

var util = require('./lib/util')

var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'HERC.ONE DEV & DEPLOY PORTAL';

screen.key(['C-q'], function(ch, key) {
    return process.exit(0);
});

var picBackground = blessed.image({
    parent: screen,
    top: -3,
    left: 'right',
    scale: 0.2,
  //  type: 'overlay',
    width: 40,
    height: 20,
    file: __dirname + '/assets/herc128.png',
    search: false
})

var picHERC_BTC = blessed.image({
    parent: screen,
    bottom: 0,
    left: 'right',
    scale: 0.2,
    width: 40,
    height: 10,
    file: __dirname + '/assets/herc-btc0-0.png',
    search: false
})

var picHERC_ETH = blessed.image({
    parent: screen,
//    top: 'center',
    bottom: 0,
    left: 'right',
    scale: 0.2,
  //  type: 'overlay',
    width: 40,
    height: 10,
    file: __dirname + '/assets/herc-eth0-0.png',
    search: false
})

var priceHERC_BTC = new blessed.Text({  
    parent: screen,
    left: 2,
//    top:0,
    bottom: 9,
    left: 'right',
    tags: true,
    content: '{#efff00-fg}HERC/BTC{/} {green-fg}+14.64%^ 0.00240172{/}',
})

var priceHERC_ETH = new blessed.Text({  
    parent: screen,
    left: 2,
    bottom: 9,
    left: 'right',
    tags: true,
    content: '{#efff00-fg}HERC/ETH{/} {green-fg}+10.62%^ 0.00008451{/}',
})

function showPrice(i) {
    if (i) {
        picHERC_ETH.hide()
        priceHERC_ETH.hide()
        picHERC_BTC.show()
        priceHERC_BTC.show()
    }
    else {
        picHERC_ETH.show()
        priceHERC_ETH.show()
        picHERC_BTC.hide()
        priceHERC_BTC.hide()
    }
    screen.render();
}

showPrice(0)

var tickI = 0
var intervalI = setInterval(()=>{
    tickI++
    showPrice((tickI & 1) == 0)
}, 5000)

screen.render();
//picBTC_ETH.render()
 
screen.key(['tab'], function(ch, key) {
    if (intervalI) {
        clearInterval(intervalI)
        intervalI = null
    }
    tickI++
    showPrice((tickI & 1) == 0)
});


var LogView = require('./ui/views/LogView')
var logView = new LogView(screen, {
  log: {
    bottom: 0,
    right: 0
  }
})
logView.log('{#efee00-fg}HERC.ONE DEV & DEPLOY PORTAL 1.0{/}')

util.init({
    logView
})

var MainMenu = require('./ui/views/MainMenu')
var mainMenuView = new MainMenu(screen)
mainMenuView.focus()

mainMenuView.on('ui', dispatcher)

var DeployContracts = require('./ui/views/DeployContracts')
var deployContractsView

var About = require('./ui/views/About')
var aboutView

var Config = require('./ui/views/Config')
var configView

function dispatcher(type, action, obj, param) {
    if (type == 'contracts') {
        if (action == 'deploy') {
            logView.log('contracts deploy')

            deployContractsView = new DeployContracts(screen)
            deployContractsView.on('ui', dispatcher)
            deployContractsView.focus()
        }
    }

    if (type == 'run-ganache') {
        util.startApp(options, 'ganache')
    }

    else if (type == 'hipr-restful') {
        if (action == 'run') {
            logView.log('hipr-restful run')
        }
    }

    else if (type == 'HERC') {
        if (action == 'run') {
            logView.log('HERC run')
        }
    }

    else if (type == 'Config') {
        if (action == 'show') {
            logView.log('Config show')
            
            updateConfiguration()

            var scriptConfig = fs.readFileSync(__dirname + '/scripts/herc-local-config.sh')

            configView = new Config(screen, {
                config: options, 
                scriptConfig: scriptConfig
            })
        }
    }
    else if (type == 'About') {
        if (action == 'show') {
            logView.log('About show')
            aboutView = new About(screen, {})
        }
    }

    else if (type == 'contracts.compile') {
        logView.log(`${type} ${action}`)
        if (action == 'ganache' || action == 'ropsten' || action == 'main') {
        }
    }
    else if (type == 'contracts.deploy') {
        logView.log(`${type} ${action}`)
        if (action == 'ganache' || action == 'ropsten' || action == 'main') {
            var network = action == 'main' ? 'live' : action
            var proc = util.execApp(__dirname + `/scripts/truffle.sh ${network}`, {
//            util.execApp('truffle migrate --network ganache', {
                path: path.resolve(options.contractsSource['assetVerification'])
            })

            proc.stdout.on('data', function(data) {
                logView.log(data)
            })
            proc.stderr.on('data', function(data) {
                logView.error(data)
            })
//            util.execApp('./t.sh', {path: 'scripts'})
//            util.execApp(__dirname + '/scripts/t.sh')
        }
        if (action == 'hide') {
            if (deployContractsView) {
                deployContractsView.destroy()
                deployContractsView = null
            }
        }
    }

    else if (type == 'deploy') {
        if (action == 'all.local.container') {
            logView.log('deloy local')

            var action = 'deploy local container'

            runScriptAction(action)
        }
        else if (action == 'all.local.docker') {
            logView.log('deloy docker')

            var action = 'deploy local docker'

            runScriptAction(action)
        }
        else if (action == 'hipr-restful.dev-server') {
            logView.log('deloy hipr-restful')

            var action = 'deploy remote container'

            runScriptAction(action)
        }
    }

    else if (type == 'herc') {
        if (action == 'airdrop') {
            logView.log('herc airdrop')

            getTopAddresses()
        }
    }

    screen.render();
}

var options = defaultConfig

// HIPR CONTAINER [

var hiprRestfulDir = path.join(options.containerDir, 'hipr-restful')

options.hiprRestfulConfig = path.join(hiprRestfulDir, 'default.json')

mkdirp(options.containerDir)
mkdirp(hiprRestfulDir)

// HIPR CONTAINER ]


var data = util.scanDataDirs(options)

util.exportHIPRConfig(options, data)


//util.startApp(options, 'ganache')

function prepareLocalConfig (options) {
    var s = `#
# GENERATED! Don't edit file! 
#

REMOTE_BUILD==${options.deploy['build-path']}

REMOTE_PEM=${options.deploy.pem}
REMOTE_HOST=${options.deploy.user}@${options.deploy.host}
    `
    fs.writeFileSync(__dirname + '/scripts/herc-local-config.sh', s)
}

function runScriptAction (action) {
    updateConfiguration()

    var proc = util.execApp('bash ' + __dirname + `/scripts/herc-cli.sh ${action}`, {
        path: path.resolve(__dirname + '/scripts')
    })

    proc.stdout.on('data', function(data) {
        logView.log(data)
    })
    proc.stderr.on('data', function(data) {
        logView.error(data)
    })
}

function updateConfiguration () {
    prepareLocalConfig({
        config: options,
        deploy: options.deploy['dev-server-0']
    })
}

// ***

var Blockchain

function getTopAddresses() {
    if (!Blockchain) {

        Blockchain = require('./lib/blockchain/blockchain');
        
        var blockchain = new Blockchain;
        
        var optionsBlockchain = require('./lib/blockchain/default.json')
        
        blockchain.init(optionsBlockchain)
    }

    new Promise(async (resolve, reject)=>{

        var res = await blockchain.getTopScoresCount()

        var scores = await blockchain.getTopScores(0, res.topScoresCount)

        let activeChain = optionsBlockchain.blockchain.activeChain,
            network = activeChain[0],
            name =  activeChain[1]
        let addr = optionsBlockchain.blockchain[network][name]

        logView.log(`Top PlayerScore contract addresses (at ${addr}):`)

        var arr = scores.topScores
        for (var i = 0; i < arr.length; i++) {
            var o = arr[i]
            logView.log(`${o.player} ${o.score}`)
        }

        logView.log(`Address list is ready in array. Need to export to csv and call airdrop`)

    //    logView.log(JSON.stringify(scores))
    })
}
