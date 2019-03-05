// WIPE SCORES [

async function wipeScores(ctx, options) {
    var blockchain = ctx.lazyInitBlockchain()
    if (!blockchain)
        return

    console.log('wipe scores...')

    await blockchain.wipeScores()

    console.log('wipe scores done')
}

// WIPE SCORES ]
// CONFIGURE SEASON [

async function configureSeason(ctx, options) {
    var blockchain = ctx.lazyInitBlockchain()
    if (!blockchain)
        return

    //    var seasonInterval = (14) * 24*60 * 60*1000 // 2 weeks
    var seasonInterval = (28) * 24*60 * 60*1000 // 2 weeks
    var season = {
        startDate: new Date().getTime(),
        releaseDate: (new Date().getTime()) + seasonInterval,
        seasonInterval,
    }
    await blockchain.payoutSetSeason(season)
}

// CONFIGURE SEASON ]
// SIMULATE SCORES [

//ganache-cli
//"./node_modules/.bin/ganache-cli -m 'dust fevercissors aware frown minor start ladder lobster success hundred clerk' -a 50"

async function simulateScores() {
    logView.log('Simulate scores')

//    await mintTokens(options);
//    return;

//    logView.log('init blockchain')

    var blockchain = lazyInitBlockchain()
    if (!blockchain)
        return

//    logView.log('init web3')

    const ganache = require("ganache-cli");
    const Web3 = require('web3')

    web3 = new Web3(ganache.provider())

    //web3.setProvider(ganache.provider());

//    logView.log('init bweb3')

    //var accs = web3.personal_listAccounts()
//    var accs = web3.eth.accounts
//    var accs = await web3.eth.personal.getAccounts()
    var bweb3 = blockchain.eth.defaultWeb3()

//    logView.log('get accounts')

//    var accs = await bweb3.eth.personal.getAccounts()

//    logView.log({'accounts': accs})

    var account0 = blockchain.eth.getAddress(0)

    blockchain.eth.options.contracts.PlayerScore.options.from = account0

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

    for (var i = defScores.length; i < 50; i++)
        defScores.push(i)

//    await configurePayout()
    
    logView.log({'initial top scores': defScores.join(', ')})

    
//    var s = await 
//    bweb3.eth.accounts.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "")
/*    .then((s, r)=>{
        console.log(s, r)
    });*/
//return
    for (var i = 0; i < defScores.length; i++) {

//        const timeout = ms => new Promise(res => setTimeout(res, ms))

        var addrWinner = blockchain.eth.getAddress(i)
        var score = defScores[i]

        logView.log(`SET_SCORE<${i}> ${addrWinner} ${score}`)

//        await timeout(200)

//        bweb3.eth.defaultAccount = addrWinner
//        blockchain.eth.options.contracts.PlayerScore.options.from = addrWinner

//        await blockchain.setScoreSecure(addrWinner, score)

        var metrics = '0x'
        try {
//            await blockchain.setScore(score)
//            return
            bweb3.defaultAccount = account0

            var sig = await blockchain.signAddressScore(account0, addrWinner, score, metrics)

            var res = await blockchain.setScoreSecureSign(addrWinner, score, metrics, sig.v, sig.r, sig.s)
//            return

            await blockchain.setScoreSecure(addrWinner, score, metrics, sig)

//        bweb3.eth.defaultAccount = addrWinner
//        blockchain.eth.options.contracts.PlayerScore.options.from = addrWinner

        }
        catch (e) {
            console.error(e)
        }

    }

    bweb3.eth.defaultAccount = accs[0]
    blockchain.eth.options.contracts.PlayerScore.options.from = bweb3.eth.defaultAccount

//    hiprInfo()
}

// SIMULATE SCORES ]


module.exports = {
    wipeScores,
    configureSeason,
    simulateScores
}
