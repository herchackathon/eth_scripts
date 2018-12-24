const
    Eos = require('./eos/eos'),
    Eth = require('./eth/eth'),
    keccak256 = require('js-sha3').keccak256,
    mongoose = require('mongoose')
    

// database [

var UserAddress

function initModels(conn) {
//    UserAddress = require('../models/UserAddress').createModel(conn)
}

async function dbConnect(url) {
    try {
        var conn = await mongoose.createConnection(url, { useNewUrlParser: true })

        initModels(conn)

//        await mongoose.connect(url, { useNewUrlParser: true })
    }
    catch (e) {
        console.log("Can't connect to db", e)
    }
}

async function setPuzzleParams(address, params) {
    try {
        var userAddress = new UserAddress({address, params})
        await userAddress.save()
    }
    catch (e) {
        console.log("setPuzzle db error", e)
    }
}

async function getPuzzleParams(address) {
    try {
        var userAddress = UserAddress.findOne({address})
        return userAddress
    }
    catch (e) {
        console.log("getPuzzle db error", e)
    }
}

// database ]

/*
Main Ethereum Network
https://mainnet.infura.io/CHs7q12LsOAlHu4D3Kvr 
Test Ethereum Network (Ropsten)
https://ropsten.infura.io/CHs7q12LsOAlHu4D3Kvr 
Test Ethereum Network (Rinkeby)
https://rinkeby.infura.io/CHs7q12LsOAlHu4D3Kvr 
Test Ethereum Network (Kovan)
https://kovan.infura.io/CHs7q12LsOAlHu4D3Kvr 
*/
/*
// web3:contract.methods [
// PlayerScore [

    Score[] public TopScores;
    mapping(address=>int) public Scores;
    function SetScore(int score) public
    function GetTopScoresCount() view public returns (uint)

// PlayerScore ]
// PuzzleManager [

    function CreatePuzzle(string metrics) public returns(uint)
    function PushMetrics(uint puzzleId, string metrics) public returns(bool)
    function CompareMetrics(uint puzzleId) public view returns(bool)
    function GetPuzzleOriginalHash(uint puzzleId) public view returns(string)
    function GetPuzzleMetrics(uint puzzleId) public view returns(bytes)

// PuzzleManager ]
// web3:contract.methods ]
*/
/*
// API methods versions [
// (done) method 0 - single address (dev) - current sign at server [

    just sign web3 at server address (for Manu dev)
    direct REST from Unity (w/o web3 client side)

// (done) method 0 - single address (dev) - current sign at server ]
// (disabled) method 1 - multiple address (old) - client/server, web3 client only sign [

    client -> req method web service
    web service -> accpet request, made transaction -> ask for sign client
    client -> reply signed transaction to web service
    web service run blockchain method and return status

// (disabled) method 1 - multiple address (old) - client/server, web3 client only sign ]
// (disabled) method 2 - multiple address (new) - web3 client js browser sign transaction and send to web service [

    unity external call -> call hipr-client js
    client web3 create & sign transaction
    client send to blockchain
    client send to web service verify transaction (hash)
    web service verify & modify transaction

// (disabled) method 2 - multiple address (new) - web3 client js browser sign transaction and send to web service ]
// (done, unsecure) method 3 - hipr-browser metamask [

    direct access to web3 via metamask

// (done, unsecure) method 3 - hipr-browser metamask ]
// (new, secure) method 4 - full secure [
    
    + herc-edge-login params register
    + hipr-browser use metamask web3 and hipr-restful
    + hipr-restful validator secure contract creation

// (new, secure) method 4 - full secure ]

// API methods versions ]
*/

// Blockchain [

class Blockchain {
    constructor () {
        this.eos = null
        this.eth = null
        this.activeChain = null
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

        new Promise(async (resolve, reject)=>{
            await dbConnect(options.mongodb)
            resolve()
        })
    }

    // PlayerScore [

    async getTopScoresCount () {
        return await this.activeChain.getTopScoresCount()
    }

    async getTopScores (index, count) {
        return await this.activeChain.getTopScores(index, count)
    }

    async setScore (score) {
        return await this.activeChain.setScore(score)
    }

    // PAYOUT [

    async payoutSetup (options) {
        return await this.activeChain.payoutSetup(options)
    }
    async payoutSetSeason (season) {
        return await this.activeChain.payoutSetSeason(season)
    }
    async payoutToWinners () {
        return await this.activeChain.payoutToWinners()
    }
    async isSeasonOver () {
        return await this.activeChain.isSeasonOver()
    }
    async payoutInfo () {
        return await this.activeChain.payoutInfo()
    }
                        
    // PAYOUT ]
    // PlayerScore ]
    // PuzzleManager [

    // X.1 SECURE PUZZLE [

    // utils [

    getRandomPuzzleStringByType (puzzleType) {
        let s = ''
        let arr = []
        if (puzzleType == 'rubic-cube') {
            for (let i = 0; i < 9 * 6; i++) {
                arr[i] = i
            }
        }
        else if (puzzleType == '15' || puzzleType == '15-test') {
            for (let i = 0; i < 15; i++) {
                arr[i] = i
            }
        }
        

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
        
        if (puzzleType != '15-test')
            arr = shuffle(arr)

        s = arr.join()
        return s;
    }
    
    // utils ]

    async registerPuzzleAddress (address, params) {
        await setPuzzleParams(address, params)
        return {
            address,
            params
        }
    }

    async createPuzzleSecure (address, puzzleType, plainTextMetrics) {
//        let uniqueId = `${Math.random()}-${new Date().getTime()}`
        let metrics
        let metricsHash
        let checkOwner
        if (plainTextMetrics != '') {
            metrics = plainTextMetrics 
            metricsHash = keccak256(metrics)
            checkOwner = false
        }
        else {
            let puzzleString = this.getRandomPuzzleStringByType(puzzleType)
            let params = await getPuzzleParams(address)
            metrics = `${puzzleString}-${params.params}`
            metricsHash = keccak256(metrics)
            console.log(`creating secure puzzle metrics='${metrics}' hash=${metricsHash}`)
            checkOwner = true
        }
        return await this.activeChain.createPuzzleSecure(address, puzzleType, plainTextMetrics, metricsHash, checkOwner) //, uniqueId)
    }

    async pushSecureMetrics (puzzleId, metricsHash) {
        return await this.activeChain.pushSecureMetrics(puzzleId, metrics)
    }
    
    async compareSecureMetrics (puzzleId, byOwner) {
        return await this.activeChain.compareSecureMetrics(puzzleId, byOwner)
    }

    // X.1 SECURE PUZZLE ]
    // X.2 UNSECURE PUZZLE [

    async createPuzzle (metrics) {
        return await this.activeChain.createPuzzle(metrics)
    }

    async pushMetrics (puzzleId, metrics) {
        return await this.activeChain.pushMetrics(puzzleId, metrics)
    }
    
    async compareMetrics (puzzleId) {
        return await this.activeChain.compareMetrics(puzzleId)
    }

    async getPuzzleOriginalMetrics (puzzleId) {
        return await this.activeChain.getPuzzleOriginalMetrics(puzzleId)
    }
    
    // X.2 UNSECURE PUZZLE ]

    async getPuzzleMetrics (puzzleId) {
        return await this.activeChain.getPuzzleMetrics(puzzleId)
    }
    
    // PuzzleManager ]
}

// Blockchain ]

module.exports = Blockchain
