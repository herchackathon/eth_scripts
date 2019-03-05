// MINT TOKENS [

async function mintTokens(options, ctx) {
    var value = 1000000

    logView.log(`Mint HERCS ${value}`)

    var blockchain = ctx.lazyInitBlockchain()
    if (!blockchain)
        return
    var web3 = blockchain.eth.defaultWeb3()
/*
    const ganache = require("ganache-cli");
    const Web3 = require('web3')

    var web3 = new Web3(ganache.provider())
*/
//    var network = 'ganache'
    var network = 'main'

    var contractPath = `${__dirname}/contracts-deploy/${network}/herc/lastest-deployed/`
    var abiPath = `${contractPath}/HERCToken.abi.json`
    var deployPath = `${contractPath}/deploy.json`

    var abi = JSON.parse(fs.readFileSync(abiPath))
    var deploy = JSON.parse(fs.readFileSync(deployPath))

    var accs = await web3.eth.personal.getAccounts()
    var address = accs[0]

    var options = {
        address: deploy.HERCToken.address,
        options: {
            from: address
        }
    }

    logView.log(`HERCToken ${options.address}`)
    logView.log(`from addr ${options.options.from}`)

    let contract = new web3.eth.Contract(abi, options.address, options.options)

    var m = contract.methods

    var gas = await m.totalSupply().estimateGas({})
    logView.log(`A totalSupply ${gas} gas`)

    var totalSupply = await m.totalSupply().call({gas})
    logView.log(`B totalSupply ${totalSupply}`)

    gas = await m.balanceOf(address).estimateGas({})
    logView.log(`C balanceOf ${address} ${gas} gas`)

    var balance = await m.balanceOf(address).call({gas})
    logView.log(`D balanceOf ${address} ${balance}`)

/*    gas = await m.mint(address, value).estimateGas({})
    logView.log(`E mint ${address} ${value} ${gas} gas`)
    
    var mint = await m.mint(address, value).send({gas})
    logView.log(`F mint ${mint}`)
*/
    var value1 = 1*1000000000000000
    var addr1 = '0xafF38D6F43913498F0E7b834a2318ac7F969E9dA'
    var addr1s = `${addr1} (fixed)`
    gas = await m.transfer(addr1, value1).estimateGas({})
    logView.log(`X1 transfer ${addr1s} ${value1} ${gas} gas`)
    
    var t1 = await m.transfer(addr1, value1).send({gas})
    logView.log(`X2 transfer ${t1}`)


    gas = await m.balanceOf(addr1).estimateGas({})
    logView.log(`B1 balanceOf ${addr1s} ${gas} gas`)

    balance = await m.balanceOf(addr1).call({gas})
    logView.log(`B1 balanceOf ${addr1s} ${balance}`)
}
    
// MINT TOKENS ]
    
module.exports = {
    mintTokens
}
