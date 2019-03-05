// HIPR: INFO [

async function hiprInfo (ctx, options) {
    var blockchain = ctx.lazyInitBlockchain()
    if (!blockchain)
        return

    var logView = ctx.logView

    var res = await blockchain.getTopScoresSecureCount()

    var scores = await blockchain.getTopScoresSecure(0, res.topScoresCount)

    var arr = scores.topScores

    logView.log(`TopScoresSecure: ${arr && arr.length}`)

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
    
module.exports = {
    hiprInfo
}
