

const fs = require('fs'),
    mkdirp = require('mkdirp'),
    shell = require('shelljs')
    blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    defaultConfig = require('./default-config.js'),
    path = require('path'),
    keccak256 = require('js-sha3').keccak256,
    _ = require('lodash')

var util = require('./lib/util')

// ACTIVE NETWORK [

function getActiveNetwork() {
/*    return {
        network: 'ganache',
        url: 'http://localhost:7545',
        backend: 'local-ganache',
        accountOnwner: null,
    }*/

    return {
        network: 'main',
        url: 'https://eth-mainnet.alchemyapi.io/jsonrpc/DCuuSowPM6WbBCkzVfyl8VRYEIjNh9L8',
        backend: 'infura-mainnet',
        accountOwner: '0x1524CE55603A34c1f4d7E47530f6EFbdAceF3dcD'
    }
}

// ACTIVE NETWORK ]
    
var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'HERC.ONE DEV & DEPLOY PORTAL';

screen.key(['C-q'], function(ch, key) {
    return process.exit(0);
});

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

var options = defaultConfig

var activeNetwork = getActiveNetwork()

options.selectedNetwork.eth = activeNetwork.network
options.selectedNetwork.backend = activeNetwork.backend

var MainMenu = require('./ui/views/MainMenu')
var mainMenuView = new MainMenu(screen, options)
mainMenuView.focus()

mainMenuView.on('ui', dispatcher)

var DeployContracts = require('./ui/views/DeployContracts')
var deployContractsView

var About = require('./ui/views/About')
var aboutView

var Config = require('./ui/views/Config')
var configView

var accountOwner

// STATE [

var HState = require('./herc-state')
var hstate = new HState

hstate.load()
var state = hstate.get()

// load default state
if (!state) {
//    state;
}

// STATE
// CONFIGURATIONS [

var ConfigurationsView = require('./ui/views/ConfigurationsView')

// CONFIGURATIONS ]
// CTX [

var ctx = {}

//ctx.configure = require('./x/configure')
ctx.info = require('./x/info')
ctx.season = require('./x/season')
ctx.payout = require('./x/payout')

ctx.lazyInitBlockchain = function () {
    return lazyInitBlockchain(options)
}

ctx.logView = logView

// CTX ]

new Promise(async (resolve, reject)=>{
    /*
        // get account owner 
        var bweb3 = blockchain.eth.defaultWeb3()
        var accs = await bweb3.eth.personal.getAccounts()
        
        accountOwner = accs[0]
*/
//    logView.log(`{#000000-bg}{#00ff88-fg}WEB3: ${network} ${url}{/}{/}`)

    var net = getActiveNetwork()
//    var network = 'ganache'
//    var url = 'http://localhost:7545'
    
    var network = net.network
    var url = net.url
    accountOwner = net.accountOwner

    if (network == 'ganache') {
        const Web3 = require('web3')

        var web3 = new Web3(new Web3.providers.HttpProvider(url))

        var accs = await web3.eth.personal.getAccounts()
        
        accountOwner = accs[0]
    }
    else if (network == 'main') {
/*        network = 'main'
        var url = 'https://eth-mainnet.alchemyapi.io/jsonrpc/DCuuSowPM6WbBCkzVfyl8VRYEIjNh9L8'
        accountOwner = '0x1524CE55603A34c1f4d7E47530f6EFbdAceF3dcD'*/
    }

    logView.log(`{#000000-bg}{#00ff88-fg}WEB3: ${network} ${url}{/}{/}`)
    logView.log(`{#000000-bg}{#00ff88-fg}WEB3: accountOwner = ${accountOwner}{/}{/}`)
})

var Validate = require('./x/validate')

var validate = new Validate(options)

// DISPATCHER [

function dispatcher(type, action, obj, param) {
    try {
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

            if (action == 'info') {
                logView.log('hipr info')

                ctx.info.hiprInfo(ctx, options)
            }
            if (action == 'wipe-scores') {
                logView.log('hipr wipe-scores')

                ctx.season.wipeScores(ctx, options)
            }
            if (action == 'configure-season') {
                logView.log('hipr configure-season')

                ctx.season.configureSeason(ctx, options)
            }
            if (action == 'simulate-scores') {
                logView.log('hipr simulate-scores')

                ctx.season.simulateScores(ctx, options)
            }

            
            if (action == 'configure-payout') {
                logView.log('hipr configure-payout')

                ctx.payout.configurePayout(ctx, options)
            }
            

            if (action == 'airdrop') {
                logView.log('herc airdrop')

//                airdrop()
            }
            if (action == 'mint') {
                logView.log('hipr mint')

                //mintTokens(hiprPayoutoptions)
            }
            if (action == 'configure') {
                logView.log('hipr configure')

                try {
                    confiugreHIPR()
                }
                catch (e) {
                    logView.error(e)
                }
            }
            if (action == 'payout') {
                logView.log(`hipr payout ${obj}`)

//                hiprPayout(obj)
            }

            if (action == 'validate') {
                logView.log(`hipr validate`)

                validate.isokay();
            }
            
        }
        else if (type == 'config') {
            console.log(type, action)
            if (action == 'select') {
                var optionsConfguration = {
                    configurations: state && state.networks
                }
                configurationsView = new ConfigurationsView(screen, optionsConfguration)
                configurationsView.on('ui', dispatcher)
                configurationsView.focus()
            }
            else if (action == 'select-item') {
                logView.log(`${type}, ${action}, ${obj}`)
    //            state.networks = state

                logView.log(`network=${JSON.stringify(state.networks[obj, null, 2])}`)
            }
            else if (action == 'hide') {
    //            configurationsView.hide()
                configurationsView.destroy()
            }
        }
    }
    catch (e) {
        console.error(e)
        console.error('<-- DISPATCHER ERROR')
    }

    screen.render();
}

// DISPATCHER ]

// HIPR CONTAINER [

var hiprRestfulDir = path.join(options.containerDir, 'hipr-restful')

options.hiprRestfulConfig = path.join(hiprRestfulDir, 'default.json')

mkdirp(options.containerDir)
mkdirp(hiprRestfulDir)

// HIPR CONTAINER ]

/*
var data = util.scanDataDirs(options)

util.exportHIPRConfig(options, data)
*/

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

//var truffleFlattener = require('truffle-flattener')

function exportContract(outpath, name, source) {

    mkdirp.sync(outpath)

    var file = `${outpath}/${name}`

    logView.log(`    {#d0d000-fg}-> Export to ${file}{/}`);

    var build = `${file}.build.json`
    var abi = `${file}.abi.json`
    var bytecode = `${file}.bytecode.json`
    var sol = `${file}.sol`
    var solFlatten = `${file}-flatten.sol`
    var meta = `${file}.meta.json`

    var f = fs.readFileSync(source, 'utf8')
    var c = JSON.parse(f)

    var buildString = f
    var abiString = JSON.stringify(c.abi, null, 2)
    var sourceString = c.source
    var bytecodeString = c.bytecode

    // save sol flatten [
    
    var sf = util.execApp(`${__dirname}/node_modules/.bin/truffle-flattener ${c.sourcePath}`, {
        path: path.dirname(source),
        async: false
    })

    if (sf.stderr != '')
        logView.error(sf.stderr)
    
    sourceString = sf.stdout

//    var sourceFlattenString = sf.stdout
//    fs.writeFileSync(solFlatten, sourceFlattenString)
    
    // save sol flatten ]

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


function lazyInitBlockchain(globalOptions) {
    if (!blockchain) {

        Blockchain = require('./lib/blockchain/blockchain');

        blockchain = new Blockchain;
        
//        global.blockchain = blockchain
        
        var options = require('./config/blockchain.json')

        optionsBlockchain = options

        var net = getActiveNetwork()
        var backend = net.backend //globalOptions.selectedNetwork.backend

        options.blockchain.activeChain[0] = 'eth' // todo: check for eos
        options.blockchain.activeChain[1] = backend

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

        chain.contracts = configureChain(chain.contracts, contractHERC, contractHIPR, contractsHIPRPath, contractsHERCPath, 'scripts')

        optionsBlockchain.___WARNING___ = "WARNING! Don't edit this file, generated automaticly" 

        fs.writeFileSync(__dirname + '/config/blockchain-lastest.json', JSON.stringify(optionsBlockchain, null, 2));

        optionsBlockchain.chain = chain

        // auto configure ]

        blockchain.init(optionsBlockchain)
    }
    else {
        // todo: correct cleanup and reload
        logView.log(`{#ffdd00-bg}{#000000-fg}Blockchain inited! Restart app for reset blockchain if new contracts deployed{/}{/}`)
    }
    
    return blockchain
}


function confiugreHIPR(options_) {
    var blockchain = lazyInitBlockchain(options)
    if (!blockchain)
        return
        
//    var pathHIPR = options_.path,
//        defaultNetwork = options.network

//    var server = 'hipr.one'
//    var hiprUrl = `http://${server}:8086/api/1.0`

//    var network = 'ganache'
//    var network = 'main'
//    var ethUrl = 'http://localhost:7545'

    var net = getActiveNetwork()
    var network = net.network 
    var ethUrl = net.url

    var pathHIPR = `${__dirname}/../hipr/HIPR-dev`
    var pathRest = `${__dirname}/../restful-hipr`

    
    logView.log(`{#efee00-fg}HIPR{/} {#008ef0-fg}${pathHIPR}{/}`)
    logView.log(`{#efee00-fg}REST{/} {#008ef0-fg}${pathRest}{/}`)

    logView.log(`Load contract (${network}) ${ethUrl}`)

    var contractsHERCPath = `${__dirname}/contracts-deploy/${network}/herc/lastest-deployed`
    var contractsHIPRPath = `${__dirname}/contracts-deploy/${network}/hipr/lastest-deployed`

    var contractHERC = require(contractsHERCPath + '/deploy.json')
    var contractHIPR = require(contractsHIPRPath + '/deploy.json')

    // configure hipr [

    logView.log(`Configure HIPR (${network})`)

    var pathHIPRConfig = `${pathHIPR}/WebBuild/public/javascripts/config.js`
    var pathHIPRConfigContracts = `${pathHIPR}/WebBuild/public/javascripts/config-contracts.js`

//    logView.log(`${pathHIPRConfig}`)
//    logView.log(`${pathHIPRConfigContracts}`)

    // eval hipr js
    try {
        var hiprConfig = fs.readFileSync(pathHIPRConfig, 'utf8')
        eval(hiprConfig)
        // updated Web3Options
    }
    catch (e) {
        logView.error(`Can't load config-contracts ${pathHIPRConfig}`)
    }

    // eval hipr-contracts js
    try {
        var hiprConfigContractsCode = fs.readFileSync(pathHIPRConfigContracts, 'utf8')
        eval(hiprConfigContractsCode)
        // updated Web3Options
    }
    catch (e) {
        logView.error(`Can't load config-contracts ${pathHIPRConfigContracts}`)
    }

    hiprConfig = Web3Options

//    hiprConfig.env = 'dev' //'production'
//    hiprConfig.dev.eth = 'ropsten' //network

//    hiprConfig.production.hipr_restful = hiprUrl

//    var contracts = hiprConfig.contracts[hiprConfig.dev.eth]
    var contracts = hiprConfig.contracts[network]

    contracts = configureChain(contracts, contractHERC, contractHIPR, contractsHIPRPath, contractsHERCPath, 'hipr')

    // split to config and config-abi [

    var hiprConfigContracts = {}

//    hiprConfig.contracts[hiprConfig.dev.eth] = contracts
    hiprConfig.contracts[network] = contracts

    _.mapKeys(hiprConfig.contracts, (network, netname) => {
        _.mapKeys(network, (contract, name) => {
            hiprConfigContracts[netname] = hiprConfigContracts[netname] || {}
            hiprConfigContracts[netname][name] = {abi: contract.abi}
            delete contract['abi']
            delete contract['abiPath']
        })
    })

    // split to config and config-abi ]

    logView.log(`{#efee00-fg}write{/} {#ef8e00-fg}${pathHIPRConfig}{/}`)

    // write config.js
    fs.writeFileSync(pathHIPRConfig, 'Web3Options = ' + JSON.stringify(hiprConfig, null, 2))

    // write config-contracts.js
    var sw = ''
    _.mapKeys(hiprConfigContracts, (network, netname) => {
        _.mapKeys(network, (contract, name) => {
            _.mapKeys(contract, (prop, propname) => {
                sw += `Web3Options.contracts["${netname}"]["${name}"]["${propname}"] = ${JSON.stringify(prop)}\n`
            })
        })
    })

    logView.log(`{#efee00-fg}write{/} {#ef8e00-fg}${pathHIPRConfigContracts}{/}`)

    fs.writeFileSync(pathHIPRConfigContracts, sw);

    // configure hipr ]
    // configure rest [

    logView.log(`Configure REST (${network})`)

    var pathRestConfig = `${pathRest}/config/default.json`

//    logView.log(`${pathRestConfig}`)

    var restConfig = require(pathRestConfig)


    restConfig.blockchain.activeChain = ['eth', network]
    chain = restConfig.blockchain['eth'][network] || {}

    chain.contracts = configureChain(chain.contracts, contractHERC, contractHIPR, contractsHIPRPath, contractsHERCPath, 'rest')

    chain.url = chain.url || ethUrl

    restConfig.blockchain['eth'][network] = chain

    logView.log(`{#efee00-fg}write{/} {#ef8e00-fg}${pathRestConfig}{/}`)

    fs.writeFileSync(pathRestConfig, JSON.stringify(restConfig, null, 2))

    // configure rest ]
    // install files [

    logView.log(`Install ABI`)

    var abiPlayerScore = fs.readFileSync(`${contractsHIPRPath}/PlayerScore.abi.json`, 'utf8')
    var abiPuzzleManager = fs.readFileSync(`${contractsHIPRPath}/PuzzleManager.abi.json`, 'utf8')
    fs.writeFileSync(`${pathRest}/contracts/PlayerScore.abi.json`, abiPlayerScore)
    fs.writeFileSync(`${pathRest}/contracts/PuzzleManager.abi.json`, abiPuzzleManager)

    logView.log(`${contractsHIPRPath}/PlayerScore.abi.json -> ${pathRest}/contracts/PlayerScore.abi.json`)
    logView.log(`${contractsHIPRPath}/PuzzleManager.abi.json -> ${pathRest}/contracts/PuzzleManager.abi.json`)

    // install files]

    logView.log('done!');
}



function configureChain(contracts, contractHERC, contractHIPR, contractsHIPRPath, contractsHERCPath, type) {
    contracts = contracts || {}
    contracts["PlayerScore"] = contracts["PlayerScore"] || {}
    contracts["PuzzleManager"] = contracts["PuzzleManager"] || {}
    contracts["HERCToken"] = contracts["HERCToken"] || {}

    contracts.PlayerScore.options = contracts.PlayerScore.options || {}
    contracts.PuzzleManager.options = contracts.PuzzleManager.options || {}
    contracts.HERCToken.options = contracts.HERCToken.options || {}

    //        contracts.PlayerScore.options.from = 
    //        contracts.PuzzleManager.options.from = 
    //        contracts.HERCToken.options.from = 

    contracts.PlayerScore.address = contractHIPR.PlayerScore.address
    contracts.PlayerScore.abiPath = `${contractsHIPRPath}/PlayerScore.abi.json`
    contracts.PlayerScore.validation = require(`${contractsHIPRPath}/PlayerScore.meta.json`)

    contracts.PuzzleManager.address = contractHIPR.PuzzleManager.address
    contracts.PuzzleManager.abiPath = `${contractsHIPRPath}/PuzzleManager.abi.json`
    contracts.PuzzleManager.validation = require(`${contractsHIPRPath}/PuzzleManager.meta.json`)

    if (contractHERC.HERCToken && contractHERC.HERCToken.address) {
        contracts.HERCToken.address = contractHERC.HERCToken.address
        contracts.HERCToken.abiPath = `${contractsHERCPath}/HERCToken.abi.json`
        contracts.HERCToken.validation = require(`${contractsHERCPath}/HERCToken.meta.json`)
    }
    else {
        logView.error(`HERCToken not deployed`)
        contracts.HERCToken.address = ''
        contracts.HERCToken.abiPath = ''
        contracts.HERCToken.validation = {}
    }

    if (type == 'hipr') {
        contracts.PlayerScore.abi = require(contracts.PlayerScore.abiPath)
        contracts.PuzzleManager.abi = require(contracts.PuzzleManager.abiPath)
        contracts.HERCToken.abi = require(contracts.HERCToken.abiPath)
        contracts.PlayerScore.abiPath = ''
        contracts.PuzzleManager.abiPath = ''
        contracts.HERCToken.abiPath = ''
        contracts.PlayerScore.validation.sourcePath = ''
        contracts.PuzzleManager.validation.sourcePath = ''
        contracts.HERCToken.validation.sourcePath = ''
    }
    else {
        // type == 'rest' || type == 'scripts'
        contracts.PlayerScore.options = {from: accountOwner}
        contracts.PuzzleManager.options = {from: accountOwner}

        var abiPath
        if (type == 'rest') {
            abiPath = 'contracts'
        }
        else { //type == scripts
            abiPath = contractsHIPRPath
        }
        
        contracts.PlayerScore.abiPath = `${abiPath}/PlayerScore.abi.json`
        contracts.PuzzleManager.abiPath = `${abiPath}/PuzzleManager.abi.json`
    }

    return contracts
}

console.log = (...a) => {
    logView.log(a)
}

console.error = (...a) => {
    logView.error(a)
}

mainMenuView.focus()
