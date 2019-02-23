const
    Eos = require('./eos/eos'),
    Eth = require('./eth/eth'),
    keccak256 = require('js-sha3').keccak256,
    mongoose = require('mongoose'),
    _ = require('lodash')
    
var Database = require('./db')
var db = new Database()

var PlayerScore = require('./modules/player-score')
var AssetValidator = require('./modules/asset-validator')
var AssetValidatorSecure = require('./modules/asset-validator-secure')

class Blockchain {
    constructor () {
        this.eos = null
        this.eth = null
        this.activeChain = null
        this.db = db
    }

    init (options) {
        let activeChain = options.blockchain.activeChain,
            network = activeChain[0],
            name =  activeChain[1]

        if (network == 'eos') {
            this.eos = new Eos(options.blockchain[network][name])
            this.activeChain = this.eos
        }
        else if (network == 'eth') {
            this.eth = new Eth(options.blockchain[network][name])
            this.activeChain = this.eth
        }
        else
            throw 'no active chain ("eos" or "eth")'

//        var self = this

        new Promise(async (resolve, reject)=>{
            await db.connect(options.mongodb)
            resolve()
        })

        // Load modules

        this.playerScore = this.lol(new PlayerScore())
        this.assetValidator = this.lol(new AssetValidator())
        this.assetValidatorSecure = this.lol(new AssetValidatorSecure())

        // Player score

        this.getTopScoresCount = this.playerScore.getTopScoresCount
        this.getTopScores = this.playerScore.getTopScores
        this.setScore = this.playerScore.setScore

        this.getTopScoresSecureCount = this.playerScore.getTopScoresSecureCount
        this.getTopScoresSecure = this.playerScore.getTopScoresSecure
        this.setScoreSecure = this.playerScore.setScoreSecure

        this.signAddressScore = this.playerScore.signAddressScore
        this.setScoreSecureSign = this.playerScore.setScoreSecureSign

        this.payoutSetup = this.playerScore.payoutSetup
        this.payoutSetSeason = this.playerScore.payoutSetSeason
        this.payoutToWinners = this.playerScore.payoutToWinners
        this.isSeasonOver = this.playerScore.isSeasonOver
        this.payoutInfo = this.playerScore.payoutInfo
        this.wipeScores = this.playerScore.wipeScores

        // Asset validator

        this.createPuzzle = this.assetValidator.createPuzzle
        this.pushMetrics = this.assetValidator.pushMetrics
        this.compareMetrics = this.assetValidator.compareMetrics
        this.validateMetrics = this.assetValidator.validateMetrics
        this.getPuzzleMetrics = this.assetValidator.getPuzzleMetrics
        this.getPuzzleOriginalMetrics = this.assetValidator.getPuzzleOriginalMetrics

        this.getRandomPuzzleStringByType = this.assetValidatorSecure.getRandomPuzzleStringByType
        this.registerPuzzleAddress = this.assetValidatorSecure.registerPuzzleAddress
        this.createPuzzleSecure = this.assetValidatorSecure.createPuzzleSecure
        this.pushSecureMetrics = this.assetValidatorSecure.pushSecureMetrics
        this.compareSecureMetrics = this.assetValidatorSecure.compareSecureMetrics

        this.validatePuzzleSecure = this.assetValidatorSecure.validatePuzzleSecure
        this.validatePuzzleSecureSign = this.assetValidatorSecure.validatePuzzleSecureSign

        this.game = this.assetValidatorSecure.game
    }

    lol (o) {
        o.activeChain = this.activeChain
        o.db = db
        return o
    }
}

module.exports = Blockchain
