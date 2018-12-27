

const fs = require('fs'),
    mkdirp = require('mkdirp'),
    shell = require('shelljs')
    blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    defaultConfig = require('./default-config.js'),
    path = require('path'),
    keccak256 = require('js-sha3').keccak256

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
            var network = action == 'main' ? 'live' : action

            if (obj.indexOf('hipr') != -1)
                runScriptTruffle('hipr', 'compile', network)
            if (obj.indexOf('herc') != -1)
                runScriptTruffle('herc', 'compile', network)
        }
    }
    else if (type == 'contracts.deploy') {
        logView.log(`${type} ${action}`)
        
        if (action == 'ganache' || action == 'ropsten' || action == 'main') {
            var network = action == 'main' ? 'live' : action

            if (obj.indexOf('hipr') != -1)
                runScriptTruffle('hipr', 'deploy', network)
            if (obj.indexOf('herc') != -1)
                runScriptTruffle('herc', 'deploy', network)
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

            logView.log('CONTRACTS ARE DEPLOYED, RESET BLOCKCHAIN FOR RECONFIGURE!')
            blockchain.reset();
        }
    }

    else if (type == 'hipr') {
        if (action == 'airdrop') {
            logView.log('herc airdrop')

            airdrop()
        }
        if (action == 'simulate-scores') {
            logView.log('hipr simulate-scores')

            simulateScores()
        }
        if (action == 'info') {
            logView.log('hipr info')

            hiprInfo()
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

function runScriptTruffle (mode, action, network) {
    
    var startDate = new Date()

    var contractType = {
        'herc': 'herctoken',
        'hipr': 'assetVerification'
    }
    var contractsPath = path.resolve(options.contractsSource[contractType[mode]])
    var proc = util.execApp('bash ' + __dirname + `/scripts/truffle.sh ${action} ${network}`, {
//            util.execApp('truffle migrate --network ganache', {
        path: contractsPath
    })

    var deployedContracts = {}
        
    proc.stdout.on('data', function(data) {
        var ss = data.split('\n')
        var a = action.split(' ')[0]
        for (var i in ss) {
    //        data = data.replace(/^\s+|\s+$/g, '');
            var s = ss[i]
            logView.log(s)
            
            function extractContractAddress(sx) {
                var s1 = null
                if (s.indexOf(sx) != -1)
                    s1 = s.replace(sx, '').trim()
                return s1
            }

            if (a == 'deploy') {
                var playerScoreContractAddress = extractContractAddress('PlayerScore: ')
                var puzzleManagerContractAddress = extractContractAddress('PuzzleManager: ')
                var hercTokenContractAddress = extractContractAddress('HERCToken: ')

                if (playerScoreContractAddress != null)
                    deployedContracts["PlayerScore"] = {address: playerScoreContractAddress}
                else if (puzzleManagerContractAddress != null)
                    deployedContracts["PuzzleManager"] = {address: puzzleManagerContractAddress}
                else if (hercTokenContractAddress != null)
                    deployedContracts["HERCToken"] = {address: hercTokenContractAddress}
            }

            var done = extractContractAddress('TRUFFLE DONE')
            if (done != null) {

                // process compiled files
                var p = contractsPath + '/build/contracts'
                var lastest = `${new Date().toISOString()}`
                var base = __dirname + `/contracts-deploy/${network}/${mode}`
                processCompiledContracts(mode, network, p, base, lastest)

                if (a == 'deploy') {
                    logView.log(JSON.stringify(deployedContracts))

                    fs.writeFileSync(`${base}/${lastest}/deploy.json`, JSON.stringify(deployedContracts, null, 2))

                    logView.log(`{#f020f0-fg}recreate symlink ${lastest} to lastest-deployed{/}`);
                    exec(`rm ${base}/lastest-deployed`)
                    exec(`ln -s ${lastest} lastest-deployed`, { path: base })
                }
                
                var endDate = new Date()

                logView.log(`>>> truffle done in ${(endDate.getTime() - startDate.getTime()) / 1000} seconds`)
            }
        }
    })
    proc.stderr.on('data', function(data) {
        logView.error(data)
    })
//            util.execApp('./t.sh', {path: 'scripts'})
//            util.execApp(__dirname + '/scripts/t.sh')
}

function processCompiledContracts(mode, network, p, base, lastest) {
    var outpath = `${base}/${lastest}`

    logView.log(`process compiled files: ${p}`)
    var files = fs.readdirSync(p)
    for (var i in files) {
        var file = files[i]

        logView.log(`  {#008000-fg}${file}{/}`);

        var name = path.parse(path.basename(file)).name
        if (mode == 'hipr') {
            if (['PuzzleManager', 'PlayerScore'].indexOf(name) != -1) {
                exportContract(outpath, name, `${p}/${file}`)
            }
        }
        else if (mode == 'herc') {
            if (['HERCToken'].indexOf(name) != -1) {
                exportContract(outpath, name, `${p}/${file}`)
            }
        }
    }

    logView.log(`{#f020f0-fg}recreate symlink ${lastest} to lastest{/}`);
    exec(`rm ${base}/lastest`)
    exec(`ln -s ${lastest} lastest`, { path: base })
}

function exportContract(outpath, name, source) {

    mkdirp.sync(outpath)

    var file = `${outpath}/${name}`

    logView.log(`    {#d0d000-fg}-> Export to ${file}{/}`);

    var build = `${file}.build.json`
    var abi = `${file}.abi.json`
    var bytecode = `${file}.bytecode.json`
    var sol = `${file}.sol`
    var meta = `${file}.meta.json`

    var f = fs.readFileSync(source, 'utf8')
    var c = JSON.parse(f)

    var buildString = f
    var abiString = JSON.stringify(c.abi, null, 2)
    var sourceString = c.source
    var bytecodeString = c.bytecode

    var m = {
        contractName: c.contractName,
        sourcePath: c.sourcePath,
        exportedSymbols: c.ast.exportedSymbols,
        compiler: c.compiler,
        updatedAt: c.updatedAt,
        validation: {
            hash: '',
            deployDate: new Date().toISOString(),
            deployBy: 'HERC Team',
            abiHash: keccak256(abiString),
            sourceSize: sourceString.length,
            sourceLines: sourceString.split('\m').length,
            sourceHash: keccak256(sourceString),
            bytecodeHash: keccak256(bytecodeString),
            buildHash: keccak256(buildString)
        }
    }
    m.validation.hash = keccak256(JSON.stringify(m.validation))

    fs.writeFileSync(meta, JSON.stringify(m, null, 2))
    fs.writeFileSync(build, buildString)
    fs.writeFileSync(abi, abiString)
    fs.writeFileSync(bytecode, bytecodeString)
    fs.writeFileSync(sol, sourceString)
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

function exec(cmd, options) {
    var proc = util.execApp(cmd, options)

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
var blockchain

var optionsBlockchain

function lazyInitBlockchain() {
    if (!blockchain) {

        Blockchain = require('./lib/blockchain/blockchain');

        blockchain = new Blockchain;
    }
//        global.blockchain = blockchain
        
        var options = require('./config/blockchain.json')

        optionsBlockchain = options

        // auto configure [

        var chain = options.blockchain[options.blockchain.activeChain[0]][options.blockchain.activeChain[1]]
        var network = chain.network
        var contractsHERCPath = `${__dirname}/contracts-deploy/${network}/herc/lastest-deployed`
        var contractsHIPRPath = `${__dirname}/contracts-deploy/${network}/hipr/lastest-deployed`

        if (!fs.existsSync(contractsHERCPath)) {
            logView.error(`Contracts HERC path not found at ${contractsHERCPath}`)
            return null
        }
        if (!fs.existsSync(contractsHIPRPath)) {
            logView.error(`Contracts HIPR path not found at ${contractsHIPRPath}`)
            return null
        }

        var contractHERC = require(contractsHERCPath + '/deploy.json')
        var contractHIPR = require(contractsHIPRPath + '/deploy.json')

        chain.contracts["PlayerScore"] = chain.contracts["PlayerScore"] || {}
        chain.contracts["PuzzleManager"] = chain.contracts["PuzzleManager"] || {}
        chain.contracts["HERCToken"] = chain.contracts["HERCToken"] || {}

        chain.contracts.PlayerScore.address = contractHIPR.PlayerScore.address
        chain.contracts.PlayerScore.abiPath = `${contractsHIPRPath}/PlayerScore.abi.json`
        chain.contracts.PlayerScore.validation = require(`${contractsHIPRPath}/PlayerScore.meta.json`)
        
        chain.contracts.PuzzleManager.address = contractHIPR.PuzzleManager.address
        chain.contracts.PuzzleManager.abiPath = `${contractsHIPRPath}/PuzzleManager.abi.json`
        chain.contracts.PuzzleManager.validation = require(`${contractsHIPRPath}/PuzzleManager.meta.json`)
        
        chain.contracts.HERCToken.address = contractHERC.HERCToken.address
        chain.contracts.HERCToken.abiPath = `${contractsHERCPath}/HERCToken.abi.json`
        chain.contracts.HERCToken.validation = require(`${contractsHERCPath}/HERCToken.meta.json`)

        optionsBlockchain.___WARNING___ = "WARNING! Don't edit this file, generated automaticly" 

        fs.writeFileSync(__dirname + '/config/blockchain-lastest.json', JSON.stringify(optionsBlockchain, null, 2));

        optionsBlockchain.chain = chain

        // auto configure ]

        blockchain.init(optionsBlockchain)
    
    return blockchain
}

// AIRDROP [

function airdrop() {

    new Promise(async (resolve, reject)=>{
        var blockchain = lazyInitBlockchain()
        if (!blockchain)
            return

        var res = await blockchain.getTopScoresCount()

        var scores = await blockchain.getTopScores(0, res.topScoresCount)

        let activeChain = optionsBlockchain.blockchain.activeChain,
            network = activeChain[0],
            name =  activeChain[1]
        let addr = optionsBlockchain.blockchain[network][name].contracts.PlayerScore.address

        logView.log(`Top PlayerScore contract addresses (at ${addr}):`)

        var arr = scores.topScores
        for (var i = 0; i < arr.length; i++) {
            var o = arr[i]
            logView.log(`${o.player} ${o.score}`)
//            console.log(`${o.player} ${o.score}`)
        }

//        logView.log(`Address list is ready in array. Need to export to csv and call airdrop`)

    //    logView.log(JSON.stringify(scores))

        var WEEK = 7*24*60*60
        let season = {
            startDate: new Date(),
            releaseDate: new Date(),
            seasonInterval: 1*WEEK
        }

        blockchain.payoutSetSeason(season)

        var over = blockchain.isSeasonOver

        logView.log(`isSeasonOver=${over}`)

        let payoutInfo = await blockchain.payoutInfo()

        logView.log(JSON.stringify(payoutInfo))

        blockchain.payoutToWinners();
    })
}

// AIRDROP ]
// SIMULATE SCORES [

//ganache-cli
//"./node_modules/.bin/ganache-cli -m 'dust fevercissors aware frown minor start ladder lobster success hundred clerk' -a 50"

async function simulateScores() {
    var blockchain = lazyInitBlockchain()
    if (!blockchain)
        return

    const ganache = require("ganache-cli");
    const Web3 = require('web3')

    web3 = new Web3(ganache.provider())

    //web3.setProvider(ganache.provider());



    //var accs = web3.personal_listAccounts()
//    var accs = web3.eth.accounts
//    var accs = await web3.eth.personal.getAccounts()
    var bweb3 = blockchain.eth.defaultWeb3()

    var accs = await bweb3.eth.personal.getAccounts()

    logView.log({'accounts': accs})

    var defScores = [
        5,
        7,
        1,
        9,
        11,

        999,
        777,
        100500,
        1,
        888
    ]

    await blockchain.wipeScores()

    configurePayout()
    
    logView.log({'initial top scores': defScores})
    
    for (var i = 0; i < 10; i++) {
        bweb3.eth.defaultAccount = accs[i]
        blockchain.eth.options.contracts.PlayerScore.options.from = bweb3.eth.defaultAccount

        await blockchain.setScore(defScores[i])
    }

    bweb3.eth.defaultAccount = accs[0]
    blockchain.eth.options.contracts.PlayerScore.options.from = bweb3.eth.defaultAccount

    var season = {
        startDate: new Date().getTime(),
        releaseDate: new Date().getTime(),
        seasonInterval: 1000,
    }
    await blockchain.payoutSetSeason(season)

    hiprInfo()
}

// SIMULATE SCORES ]

// CONFIGURE: PAYOUT [

function configurePayout() {
    
    let payoutOptions = {
        hercContract: optionsBlockchain.chain.contracts.HERCToken.address,
        payoutBoss: blockchain.eth.options.contracts.PlayerScore.options.from,
        rewards: [
            1000,   // 1st
            900,    // 2nd
            800,    // 3rd
            700,
            600,
            500,
            400,
            300,
            200,
            100,
        ]
    }

    // 11-50 = 10 HERC
    for (var i = 11; i < 50; i++)
        payoutOptions.rewards.push(10)

    blockchain.payoutSetup(payoutOptions)
}

// CONFIGURE: PAYOUT ]
    
// HIPR: INFO [
    
async function hiprInfo () {
    var blockchain = lazyInitBlockchain()
    if (!blockchain)
        return

    var res = await blockchain.getTopScoresCount()

    var scores = await blockchain.getTopScores(0, res.topScoresCount)

    logView.log('TopScores:')
    var arr = scores.topScores
    for (var i = 0; i < arr.length; i++) {
        var o = arr[i]
        logView.log(`  ${o.player} ${o.score}`)
//            console.log(`${o.player} ${o.score}`)
    }

    let payoutInfo = await blockchain.payoutInfo()
    var s = ''
    if (payoutInfo.rewards && payoutInfo.rewards.length) {
        for (var i = 0; i < payoutInfo.rewards.length; i++) {
            var r = payoutInfo.rewards[i]
            s += r.rank + '-' + r.reward + ' '
        }
        payoutInfo['rewards'] = s
    }
    logView.log(JSON.stringify(payoutInfo, null, 2))

    var over = await blockchain.isSeasonOver()
    logView.log(`isSeasonOver=${over.result}`)

}

// HIPR: INFO ]

/*
new Promise(async (resolve, reject)=>{
    await simulateScores()
})*/

console.log = (...a) => {
    logView.log(a)
}

console.error = (...a) => {
    logView.error(a)
}

//console.log(1, 2, 3)
