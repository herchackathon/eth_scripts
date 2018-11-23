const
    sys = require('./sys'),
    fs = require('fs'),
    walk = require('walkdir'),
    path = require('path'),
    shell = require('shelljs'),
    keccak256 = require('js-sha3').keccak256

shell.config.silent = true

var logView = {
    log: ()=>{},
    error: ()=>{}
}

function init (options) {
    logView = options.logView
}

function execApp(cmd, options) {
    logView.log(`exec ${cmd}`)
    var res
    if (options && options.path) {
        res = shell.pushd(options.path)
        res = sys.sh(cmd, {async:true})
        shell.popd()
    }
    else 
        res = sys.sh(cmd, {async:true})
    return res
/*    shell.pushd(path)
    var res = sh(cmd, {async:true})
    shell.popd()*/
}

function startApp(options, app) {
    logView.log(`run ${app}`)
    if (app == 'ganache') {
        var ganacheApp = path.join(options.containerDir, options.apps.ganache.bin)
        if (!fs.existsSync(`${ganacheApp}.done`)) {
            logView.log(`downloading ${app} ${options.apps.ganache.url}`)

            var interval = setInterval(()=>{
                var stat = fs.statSync(ganacheApp)
                logView.log(`downloading ${app} ${Math.round(stat.size/1024)} KB`)
            }, 10000)

            sys.download(options.apps.ganache.url, ganacheApp, (result) => {
                clearInterval(interval)
                if (result != undefined) {
                    logView.log(`download ${app} error ${result}`)
                    return
                }
                logView.log(`download ${app} done`)
                fs.writeFileSync(`${ganacheApp}.done`, options.apps.ganache.url)
                execApp(`chmod +x ${ganacheApp}`)
                execApp(ganacheApp)
            })
        }
        else {
//            execApp(ganacheApp)
//            execApp('gnome-terminal -- ./ganache.sh', {path: 'scripts'})
            execApp('./ganache.sh', {path: 'scripts'})
        }
    }
}

function scanDataDirs(options) {
    var contracts = {
        nets: {}
    }
    var contractsDeployDir = path.resolve(options.contractsDeployDir)
    walk.sync(contractsDeployDir, {}, (f, stat) => {
        var ss = f.replace(contractsDeployDir + '/', '').split('/')
        var net
        var version
        if (ss.length > 0) {
            net = ss[0]
            if ((ss.length == 1 && stat.isDirectory()) || ss.length > 1)
            contracts.nets[net] = contracts.nets[net] || {
                versions: {}
            }
        }

        if (ss.length == 3 && stat.isFile()) {
            version = ss[1]
            var contract = contracts.nets[net].versions[version] = (contracts.nets[net].versions[version] || {})

            var type = path.extname(f) 
            var name = path.basename(f, type)
            if (type == '.json') { // ! .sol
                type = path.extname(name)
                name = path.basename(name, type)
            }
            if (typeof type === 'string')
                type = type.replace('.', '')
            contract[name] = contract[name] || {
                deployDate: '',
                deployBy: '',
                abiHash: '',
                sourceSize: 0,
                sourceLines: 0,
                sourceHash: '',

                gist: {
                    bytecode: /* PS */ 'https://gist.github.com/xen1024/ae4ebc89b8673de520f3c67c7423530f',
                    bytecode: /* PM */ 'https://gist.github.com/xen1024/08e30905a2951c54d25eafd8cee117a1'
                },

                abi: {
                    status: 'not found',
                    file: '',
                    hash: '0',
                    size: 0,
                    lines: 0,
                    date: new Date(),
                    owner: 'hipr'
                },
                sol: {
                    status: 'not found',
                    file: '',
                    hash: '0',
                    size: 0,
                    lines: 0,
                    date: new Date(),
                    owner: 'hipr'
                },
                bytecode: {
                    status: 'not found',
                    file: '',
                    hash: '0',
                    size: 0,
                    lines: 0,
                    date: new Date(),
                    owner: 'hipr'
                },
            }

            var c = contract[name][type]
            c.status = 'deployed'
            c.file = f
            c.size = stat.size
            var s = fs.readFileSync(f, 'utf8')
            c.lines = s.split('\n').length
            c.hash = keccak256(s)
            c.date = new Date(version)

            var cc = contract[name]
            contract.abiHash = cc.abi.hash
            contract.deployDate = cc.sol.date
            contract.deployBy = cc.sol.owner
            contract.sourceSize = cc.sol.size
            contract.sourceLines = cc.sol.lines
            contract.sourceHash = cc.sol.hash
        }
    })

    return {
        contracts
    }
}

function exportHIPRConfig(options, data) {
    
    // read config?

    return

    for (var k in data.contracts.nets) {
        var net = data.contracts.nets[k]

        console.log(version)

        var Web3Options = {
            env: 'dev', 
            dev: {
                hipr_restful: 'http://localhost:8086/api/1.0',
                eth: 'ropsten'
            },
            production: {
                hipr_restful: 'http://server:8086/api/1.0',
                eth: 'mainnet'
            },
            contracts: {
                mainnet: {
/*                    'PlayerScore': {
                        abi: [{"anonymous": false,"inputs": [{"indexed": true,"name": "previousOwner","type": "address"},{"indexed": true,"name": "newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"constant": false,"inputs": [],"name": "renounceOwnership","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "score","type": "int256"}],"name": "SetScore","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "GetTopScoresCount","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "isOwner","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "Scores","outputs": [{"name": "","type": "int256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "uint256"}],"name": "TopScores","outputs": [{"name": "player","type": "address"},{"name": "score","type": "int256"}],"payable": false,"stateMutability": "view","type": "function"}],//[{"constant":false,"inputs":[{"name":"score","type":"int256"}],"name":"SetScore","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"TopScores","outputs":[{"name":"player","type":"address"},{"name":"score","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"Scores","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetTopScoresCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
                        address: '0xeed0eb7a4251ce217b7d37d370267735626ad2c6',//'0xA07B1FE246D9020f6884eA9d432B551Ea534b13f',
                        validation: {
                            hash: '',
                            deployDate: '',
                            deployBy: '',
                            abiHash: '',
                            sourceSize: 0,
                            sourceLines: 0,
                            sourceHash: ''
                        }
                    },
                    'PuzzleManager': {
                        abi: [{"constant":false,"inputs":[],"name":"acceptPuzzle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"puzzleId","type":"uint256"}],"name":"GetPuzzleMetrics","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"puzzleId","type":"uint256"}],"name":"CompareMetrics","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"puzzleId","type":"uint256"}],"name":"GetPuzzleOriginalMetrics","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"metrics","type":"string"},{"name":"uniqueId","type":"string"}],"name":"CreatePuzzle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"puzzleId","type":"uint256"},{"name":"metrics","type":"string"}],"name":"PushMetrics","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"puzzleId","type":"uint256"},{"indexed":false,"name":"uniqueId","type":"string"}],"name":"PuzzleCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}],
                        address: '0xf792c43f23c39f7de185cfdc6ce96aa69e9f00c1',
                        validation: {
                            hash: '',
                            deployDate: '',
                            deployBy: '',
                            abiHash: '',
                            sourceSize: 0,
                            sourceLines: 0,
                            sourceHash: ''
                        }
                    }*/
                },
            }
        }

        fs.write(options.hiprRestfulConfig)
    }
}

function deployContract(options, network, contract) {
    execApp('truffle migrate --network ganache')
}

module.exports = {
    init,
    startApp,
    scanDataDirs,
    exportHIPRConfig,
    deployContract,
    execApp
}
