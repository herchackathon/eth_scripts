// HIPR PAYOUT [

var PayoutView = require('../ui/views/PayoutView')
var payoutView

var optionsHipr

async function hiprPayout(mode, param) {
    logView.log('HIPR payout to winners')

    var blockchain = lazyInitBlockchain()
    if (!blockchain)
        return
    var web3 = blockchain.eth.defaultWeb3()

    if (mode == 'init') {

        var startDate = new Date('2019-01-01')
        var releaseDate = new Date('2019-01-31')
        var seasonInterval = releaseDate.getTime() - startDate.getTime()

        var season = {
            startDate,
            releaseDate,
            seasonInterval
        }

        var eth = blockchain.eth
        var playerScore = eth.options.contracts['PlayerScore']
        var puzzleManager = eth.options.contracts['PuzzleManager']

        var o = {
            season,
            web3: {
                url: eth.options.url,
                network: eth.options.network,
                PlayerScore: {
                    address: playerScore.address,
                    updatedAt: playerScore.validation.updatedAt
                },
                PuzzleManager: {
                    address: puzzleManager.address,
                    updatedAt: puzzleManager.validation.updatedAt
                }
            }
        }

        optionsHipr = o

        var payoutView = new PayoutView(screen, o)
        payoutView.on('ui', dispatcher)
    }
    else if (mode == 'setup-blockchain') {

        var season = {
            startDate: optionsHipr.season.startDate.getTime(),
            releaseDate: optionsHipr.season.startDate.getTime(),
            seasonInterval: optionsHipr.season.seasonInterval
        }

        await blockchain.payoutSetSeason(season)
    }
    else if (mode == 'manual') {
        var res = await blockchain.getTopScoresCount()

        var scores = await blockchain.getTopScores(0, res.topScoresCount)
    
        logView.log('TopScores:')
        var arr = scores.topScores
        for (var i = 0; i < arr.length; i++) {
            var o = arr[i]
            logView.log(`  ${o.player} ${o.score}`)
    //            console.log(`${o.player} ${o.score}`)
        }
    
    
    }
    else if (mode == 'auto') {

    }
    else if (mode == 'force') {

    }
}

// HIPR PAYOUT ]

// CONFIGURE: PAYOUT [

async function configurePayout() {
    
    var HERCToken = optionsBlockchain.chain.contracts.HERCToken || {address: '0x123456789'}

    let payoutOptions = {
        hercContract: HERCToken.address,
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
    for (var i = payoutOptions.rewards.length; i < 100; i++)
        payoutOptions.rewards.push(10)

    logView.log('payout setup')
    logView.log(JSON.stringify(payoutOptions))

    await blockchain.payoutSetup(payoutOptions)
}

// CONFIGURE: PAYOUT ]



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

module.exports = {
    configurePayout
}
