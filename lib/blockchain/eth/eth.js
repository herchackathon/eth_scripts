const 
    fs = require('fs'),
    Web3 = require('web3')

var _web3 = {}

var playerScore
var puzzleManager

var options

class Eth {
    constructor (options) {
        this.options = options

        this.playerScore = null
        this.puzzleManager = null

        this.web3 = _web3

        this.init(options)
    }

    // web3:init [

    getWeb3 (url) {
        let web3 = _web3[url]
        if (web3 == undefined) {
            web3 = new Web3(new Web3.providers.HttpProvider(url))
            _web3[url] = web3
            this.initWeb3(web3)
        }
        return web3
    }

    defaultWeb3 () {
        let url = options.url
        return this.getWeb3(url)
    }

    // todo: review sigle instance 

    initWeb3 (web3) {
    //    web3.eth.subscribe('an_event', (error, event) => {})
        this.playerScore = this.contractInit(web3, options.contracts['PlayerScore'])
        this.puzzleManager = this.contractInit(web3, options.contracts['PuzzleManager'])
    }

    init (options_) {
        options = options_
        this.defaultWeb3()
    }

    // web3:init ]
    // web3:contract [

    contractInit (web3, options) {
        
        //console.log('load abi from', options.abiPath)

        var abi = JSON.parse(fs.readFileSync(options.abiPath))
        
        let contract = new web3.eth.Contract(abi, options.address, options.options)
    //    contract.events.an_event({}, (error, event) => {})
        
        //if (!!contract)
        //    console.log('new contract success', options.abiPath, "at address:", options.address)

        return contract
    }

    // web3 events 1.0 common - todo: review [
    /*
        *** this is the prototype of:
        contractGetPastEvents (TYPE web3, URGENT TYPE contract, STRING eventName, ANY options, CB cb) {
    */

    contractGetPastEvents (contract, eventName, options, cb) {
        contract.getPastEvents(eventName, options, (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            results.forEach(event => {
                cb(event)
            })
        })
    }

    getLastEvents () {
        // todo: 
    }

    async getEvents () {

    }

    contractAttachEvents () {
        this.contract.events.CreatePuzzle({}, (error, event) => {
            this.notify('CreatePuzzle', error, event);
        });
    }

    // web3 events 1.0 common - todo: review ]

    // web3:contract ]
    // web3 core ]
    // utils [


    
    // utils ]
    // api [
    // PlayerScore [

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
            let web3 = this.defaultWeb3()
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
            let web3 = this.defaultWeb3()
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

    // PAYOUT LOGIC [

    async payoutSetup (options) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let payoutAddress = options.payoutAddress
            let HERCContractAddress = options.HERCContractAddress

            let gas = await m.SetHERCTokenAddress(HERCContractAddress).estimateGas()
            let result = await m.SetHERCTokenAddress(HERCContractAddress).send({
                from, 
                gas //: 4712388
            })

            gas = await m.SetPayoutAddress(payoutAddress).estimateGas()
            result = await m.SetPayoutAddress(payoutAddress).send({
                from, 
                gas //: 4712388
            })

            let rewards = options.rewards
            for (var i = 0; i < rewards.length; i++) {
                var rank = i
                var reward = rewards[i]
                gas = await m.SetWinnerReward(rank, reward).estimateGas()
                result = await m.SetPayoutAddress(rank, reward).send({
                    from, 
                    gas //: 4712388
                })
            }
            return {
                result
            }
        }
        catch (e) {
            console.log('payoutSetup error', e.message)
            return {
                err: e.message
            }
        }
    }

    async payoutSetSeason (season) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let startDate = season.startDate
            let releaseDate = season.releaseDate
            let seasonInterval = season.seasonInterval

            let gas = await m.SetNextSeasonReleaseDate(startDate, releaseDate).estimateGas()
            let result = await m.SetNextSeasonReleaseDate(startDate, releaseDate).send({
                from, 
                gas //: 4712388
            })

            gas = await m.SetSeasonInterval(seasonInterval).estimateGas()
            result = await m.SetSeasonInterval(seasonInterval).send({
                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.log('payoutSetSeason error', e.message)
            return {
                err: e.message
            }
        }
    }

    async payoutToWinners () {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let gas = await m.PayoutToWinners().estimateGas()
            let result = await m.PayoutToWinners().send({
                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.log('payoutToWinners error', e.message)
            return {
                err: e.message
            }
        }
    }

    async isSeasonOver () {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let gas = await m.IsSeasonOver().estimateGas()
            let result = await m.IsSeasonOver().send({
                from, 
                gas //: 4712388
            })

            return {
                result
            }
        }
        catch (e) {
            console.log('isSeasonOver error', e.message)
            return {
                err: e.message
            }
        }
    }

    async payoutInfo () {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from
            var m = this.playerScore.methods

            let rewrads = []
            for (var i = 0; i < count; i++) {
                let reward = await m.winnerReward(i).call()
                rewards.push({rank: i, reward})
            }

            let startDate = await m.startDate().call()
            let releaseDate = await m.releaseDate().call()
            let seasonInterval = await m.seasonInterval().call()

            let hercContract = await m.hercContract().call()
            let payoutAddress = await m.payoutBoss().call()

            return {
                rewards,
                startDate,
                releaseDate,
                seasonInterval,
                hercContract,
                payoutAddress
            }
        }
        catch (e) {
            console.log('isSeasonOver error', e.message)
            return {
                err: e.message
            }
        }
    }

    // PAYOUT LOGIC ]

    // PlayerScore ]
    // PuzzleManager [

    // web3 events 1.1 createPuzzle [

    async getEventForUniqueId (uniqueId) {
        let contract = this.puzzleManager
        let eventName = 'PuzzleCreated'
        let options = {}
//        let json = await new Promise(async resolve => 
//            resolve(await blockchain.getTopScoresCount()));

        // experimental cachedEvents
        // todo: review multiple requests errors processing
        this.cachedEvents = this.cachedEvents || {}
    
        let event = await new Promise(async (resolve, reject) => {
            contract.getPastEvents(eventName, options, (error, results) => {
                if (error)
                    return reject(error)

                for (var i = 0; i < results.length; i++) {
                    var res = results[i]
                    this.cachedEvents[res.returnValues.uniqueId] = res
                }

                let event = this.cachedEvents[uniqueId]
                
                resolve(event)
            })
        })

        return event
    }

    // web3 events 1.1 createPuzzle ]
    // X.1 SECURE PUZZLE [

    async createPuzzleSecure (address, puzzleType, plainTextMetrics, metricsHash, checkOwner) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let uniqueId = Math.random().toString(36)+Math.random().toString(36);

            let gas = await this.puzzleManager.methods.CreateSecurePuzzle(address, puzzleType, plainTextMetrics, metricsHash, checkOwner, uniqueId).estimateGas()
            let result = await this.puzzleManager.methods.CreateSecurePuzzle(address, puzzleType, plainTextMetrics, metricsHash, checkOwner, uniqueId).send({
                from,
                gas
            })
            let event = await this.getEventForUniqueId(uniqueId)
            var puzzleId = event.returnValues.puzzleId
            return {
                puzzleId: parseInt(puzzleId)
            }
        }
        catch (e) {
            console.log('createPuzzleSecure error', e.message)
            return {
                err: e.message
            }
        }
    }

    async pushSecureMetrics (puzzleId, metrics) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.pushSecureMetrics(puzzleId, metrics).estimateGas()
            let result = await this.puzzleManager.methods.pushSecureMetrics(puzzleId, metrics).send({
                from, 
                gas
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('pushSecureMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }

    async compareSecureMetrics (puzzleId, byOwner) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.compareSecureMetrics(puzzleId, byOwner).estimateGas()
            let result = await this.puzzleManager.methods.compareSecureMetrics(puzzleId, byOwner).call({
                from, 
                gas
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('compareMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }

    // X.1 SECURE PUZZLE ]
    // X.2 UNSECURE PUZZLE [

    async createPuzzle (metrics) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let uniqueId = Math.random().toString(36)+Math.random().toString(36);

            let gas = await this.puzzleManager.methods.CreatePuzzle(metrics, uniqueId).estimateGas()
            let result = await this.puzzleManager.methods.CreatePuzzle(metrics, uniqueId).send({
                from,
                gas
            })
            let event = await this.getEventForUniqueId(uniqueId)
            var puzzleId = event.returnValues.puzzleId
            return {
                puzzleId: parseInt(puzzleId)
            }
        }
        catch (e) {
            console.log('createPuzzle error', e.message)
            return {
                err: e.message
            }
        }
    }

    async pushMetrics (puzzleId, metrics) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.PushMetrics(puzzleId, metrics).estimateGas()
            let result = await this.puzzleManager.methods.PushMetrics(puzzleId, metrics).send({
                from, 
                gas
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('pushMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }

    async compareMetrics (puzzleId) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.CompareMetrics(puzzleId).estimateGas()
            let result = await this.puzzleManager.methods.CompareMetrics(puzzleId).call({
                from, 
                gas
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('compareMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }

    async getPuzzleOriginalMetrics (puzzleId) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.GetPuzzleOriginalMetrics(puzzleId).estimateGas()
            let metrics = await this.puzzleManager.methods.GetPuzzleOriginalMetrics(puzzleId).call({
                from, 
                gas
            })
            return {
                metrics
            }
        }
        catch (e) {
            console.log('getPuzzleOriginalMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }

    // X.2 UNSECURE PUZZLE ]

    async getPuzzleMetrics (puzzleId) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.GetPuzzleMetrics(puzzleId).estimateGas()
            let metrics = await this.puzzleManager.methods.GetPuzzleMetrics(puzzleId).call({
                from, 
                gas
            })
            return {
                metrics
            }
        }
        catch (e) {
            console.log('getPuzzleMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    // PuzzleManager ]
    // api ]
}

module.exports = Eth
