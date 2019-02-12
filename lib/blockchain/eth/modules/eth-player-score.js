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
            let gas = await this.playerScore.methods.SetScore(score).estimateGas()
            let result = await this.playerScore.methods.SetScore(score).send({
                from, 
                gas //: 4712388
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
