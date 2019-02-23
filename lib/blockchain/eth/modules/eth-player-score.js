const keccak256 = require('js-sha3').keccak256

class EthPlayerScore {

    async getTopScoresCount () {
        try {
            let topScoresCount = await this.playerScore.methods.GetTopScoresCount().call({
    //            from,
    //            gas,
    //            gasPrice
            })
            return {
                topScoresCount: parseInt(topScoresCount)
            }
        }
        catch (e) {
            console.log('getTopScoresCount error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    async getTopScores (index, count) {
        try {
            let from = this.options.contracts.PlayerScore.options.from

            let topScores = []
            for (; count; count--, index++) {
                let score = await this.playerScore.methods.TopScores(index).call()
                topScores.push(score)
            }
            return {
                topScores
            }
        }
        catch (e) {
            console.log('getTopScores error', e.message)
            return {
                err: e.message
            }
        }
    }

    async setScore (score) {
        try {
            let from = this.options.contracts.PlayerScore.options.from
            let gas = await this.playerScore.methods.SetScore(score).estimateGas({
                from
            })
            gas += 1
//            gas = '0x' + gas.toString(16)
            let result = await this.playerScore.methods.SetScore(score).send({
                from, 
                gas: gas,// : 4712388
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('setScore error', e.message)
            return {
                err: e.message
            }
        }
    }

    // SECURE [

    async getTopScoresSecureCount () {
        try {
            let topScoresCount = await this.playerScore.methods.GetTopScoresSecureCount().call({
    //            from,
    //            gas,
    //            gasPrice
            })
            return {
                topScoresCount: parseInt(topScoresCount)
            }
        }
        catch (e) {
            console.log('getTopScoresSecureCount error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    async getTopScoresSecure (index, count) {
        try {
            let from = this.options.contracts.PlayerScore.options.from

            let topScores = []
            for (; count; count--, index++) {
                let score = await this.playerScore.methods.TopScoresSecure(index).call()
                topScores.push(score)
            }
            return {
                topScores
            }
        }
        catch (e) {
            console.log('getTopScoresSecure error', e.message)
            return {
                err: e.message
            }
        }
    }

    async setScoreSecure (address, score) {
        try {
            let from = this.options.contracts.PlayerScore.options.from
            let gas = await this.playerScore.methods.SetScoreSecure(address, score).estimateGas()
            let result = await this.playerScore.methods.SetScoreSecure(address, score).send({
                from, 
                gas //: 4712388
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('setScoreSecure error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    tohex(msg){
        var hexmsg = "";
        for(var i=0; i<msg.length; i++){
            hexmsg += msg.charCodeAt(i).toString(16);
        }
        return "0x"+hexmsg;
    }
    
    
    verificationScheme(str){
        var msghex = tohex(str);
        var sig = web3.eth.sign(web3.eth.accounts[0], msghex);
    
        var r = sig.slice(0, 66);
        var s = '0x' + sig.slice(66, 130);
        var v = '0x' + sig.slice(130, 132);
        v = web3.toDecimal(v);
    
        var verificationMessage = "\x19Ethereum Signed Message:\n" + str.length + str;
        var verificationMessageHash = web3.sha3(verificationMessage);
    
        return [verificationMessageHash, v, r, s];
    }
    

    async signAddressScore (address, playerAddress, score, metrics) {
        var msg = `${playerAddress}${score}${metrics}`
        var web3 = this.defaultWeb3()
//        msg = web3.utils.utf8ToHex(msg)
/*
        web3.eth.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
        .then((s)=>{
            console.log(s)
        });
        return

*/

//        this.eth.hd

        var account = this.getHDAccount(0)

        console.log(`SIGN SCORE: '${msg}'`)
        var h = '0x' + keccak256(msg)
//        h = '0x00'

/*        let msg = "Some data"
        let prefix = "\x19Ethereum Signed Message:\n" + msg.length
        let msgHash1 = web3.utils.sha3(prefix+msg)
  */  
//        var privkey = account.privkey
        //var privkey = '2B2F65A08771C106D2109C3DFF7D77C5BDCC6EF78D287E6E1EADAB0483126BDC'
        var privkey = 'DC65F090494F1667F9FF015B7D46E98D3841C5B3D92181E5B431B4FDB3928B05'

        console.log(`hash: '${h}'`)
        var sig = await web3.eth.accounts.sign(h, '0x'+privkey)
        console.log(`> v=${sig.v} r=${sig.r}`)
        console.log(`> s=${sig.s}`)

        let whoSigned2 = await web3.eth.accounts.recover(sig)

//        var h = web3.utils.sha3(msg)
//        var s = await web3.eth.sign(h, address)
//        var sig = s.slice(2)

        return sig
    }

    async setScoreSecureSign (address, score, metrics, v, r, s) {
        try {
            var m = this.playerScore.methods

            v = parseInt(v, 16)
/*            var r = `0x${sig.slice(0, 64)}`
            var s = `0x${sig.slice(64, 128)}`
            var v = web3.toDecimal(sig.slice(128, 130)) + 27
        
//            function SetScoreSecureSign(uint score, string metrics, uint8 v, bytes32 r, bytes32 s) 
*/
            let from = this.options.contracts.PlayerScore.options.from
//            let gas2 = await this.playerScore.methods.SetScore(score).estimateGas()
//            let gas1 = await m.SetHERCTokenAddress(address).estimateGas()
            let gas = await m.SetScoreSecureSign(address, score, metrics, v, r, s).estimateGas()
            gas += 1
            let result = await m.SetScoreSecureSign(address, score, metrics, v, r, s).send({
                from, 
                gas //: 4712388
            })
            return {
                result
            }
        }
        catch (e) {
            console.error('setScoreSecureSign error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    // SECURE ]

    // PAYOUT LOGIC [

    async payoutSetup (options) {
        try {
            let web3 = this.defaultWeb3()
//            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let payoutAddress = options.payoutBoss
            let hercContract = options.hercContract

            let gas = await m.SetHERCTokenAddress(hercContract).estimateGas()
            let result = await m.SetHERCTokenAddress(hercContract).send({
//                from, 
                gas //: 4712388
            })

            gas = await m.SetPayoutAddress(payoutAddress).estimateGas()
            result = await m.SetPayoutAddress(payoutAddress).send({
//                from, 
                gas //: 4712388
            })

            let rewards = options.rewards
            for (var i = 0; i < rewards.length; i++) {
                var rank = i
                var reward = rewards[i]
                gas = await m.SetWinnerReward(rank, reward).estimateGas()
                result = await m.SetWinnerReward(rank, reward).send({
//                    from, 
                    gas //: 4712388
                })
            }
            return {
                result
            }
        }
        catch (e) {
            console.error('payoutSetup error', e.message)
            return {
                err: e.message
            }
        }
    }

    async payoutSetSeason (season) {
        try {
            let web3 = this.defaultWeb3()
//            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let startDate = season.startDate
            let releaseDate = season.releaseDate
            let seasonInterval = season.seasonInterval

            let gas = await m.SetNextSeasonReleaseDate(startDate, releaseDate).estimateGas()
            let result = await m.SetNextSeasonReleaseDate(startDate, releaseDate).send({
//                from, 
                gas //: 4712388
            })

            gas = await m.SetSeasonInterval(seasonInterval).estimateGas()
            result = await m.SetSeasonInterval(seasonInterval).send({
//                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.error('payoutSetSeason error', e.message)
            return {
                err: e.message
            }
        }
    }

    async payoutToWinners () {
        try {
            let web3 = this.defaultWeb3()
//            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let gas = await m.PayoutToWinners().estimateGas()
            let result = await m.PayoutToWinners().send({
//                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.error('payoutToWinners error', e.message)
            return {
                err: e.message
            }
        }
    }

    async isSeasonOver () {
        try {
            let web3 = this.defaultWeb3()
//            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let gas = await m.IsSeasonOver().estimateGas()
            let result = await m.IsSeasonOver().call({
//                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.error('isSeasonOver error', e.message)
            return {
                err: e.message
            }
        }
    }

    async payoutInfo () {
        try {
            let web3 = this.defaultWeb3()
//            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods
//            let topScoresCount = await this.playerScore.methods.GetTopScoresCount().call()

            let rewardsCount = parseInt(await m.GetTopScoresMax().call())
            let rewards = []
            for (var i = 0; i < rewardsCount; i++) {
//                console.log(`get reward ${i}`)
                let reward = await m.winnerReward(i).call()
                rewards.push({rank: i, reward})
            }

            let lastWipeDate = await m.lastWipeDate().call()
            let startDate = await m.startDate().call()
            let releaseDate = await m.releaseDate().call()
            let seasonInterval = await m.seasonInterval().call()

            let hercContract = await m.hercContract().call()
            let payoutAddress = await m.payoutBoss().call()

            return {
                rewards,
                lastWipeDate,
                startDate,
                releaseDate,
                seasonInterval,
                hercContract,
                payoutAddress
            }
        }
        catch (e) {
            console.error('payoutInfo error', e.message)
            return {
                err: e.message
            }
        }
    }

    async wipeScores () {
        try {
            let web3 = this.defaultWeb3()
//            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let gas = await m.WipeScores().estimateGas()
            let result = await m.WipeScores().send({
//                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.error('WipeScores error', e.message)
            return {
                err: e.message
                }
        }
    }

    // PAYOUT LOGIC ]
}

module.exports = EthPlayerScore
