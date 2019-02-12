const
    keccak256 = require('js-sha3').keccak256

class AssetValidator {

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
    // game [

    generatePuzzle (puzzleType, initString) {

        if (puzzleType == '15') {
            var field = []
            for (var i = 0; i < 3; i++) {
                field[i] = []
                for (var j = 0; j < 3; j++) {
                    field[i].push(i * 3 + j)
                }
            }

            var moves = []
            var movesCount = 30

//            var 

            for (var i = 0; i < movesCount; i++) {

            }
        }

    }

    // game ]

    async registerPuzzleAddress (address, params) {
        var paramsHash = keccak256(JSON.stringify(params))
        await this.db.setPuzzleParams(address, paramsHash)
        return {
            address,
            params
        }
    }

    async createPuzzleSecure (address, puzzleType, plainTextMetrics, params) {
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
            let params = await this.db.getPuzzleParams(address)
            metrics = `${puzzleString}-${params.params}`
            metricsHash = keccak256(metrics)
            console.log(`creating secure puzzle metrics='${metrics}' hash=${metricsHash}`)
            checkOwner = true
        }
        var puzzle = await this.activeChain.createPuzzleSecure(address, puzzleType, plainTextMetrics, metricsHash, params, checkOwner) //, uniqueId)
        if (!puzzle.err) {
            puzzle.field = generatePuzzle(puzzleType, )
        }
        return puzzle
    }

    async pushSecureMetrics (puzzleId, metricsHash) {
        return await this.activeChain.pushSecureMetrics(puzzleId, metrics)
    }
    
    async compareSecureMetrics (puzzleId, byOwner) {
        return await this.activeChain.compareSecureMetrics(puzzleId, byOwner)
    }
}

module.exports = AssetValidator
