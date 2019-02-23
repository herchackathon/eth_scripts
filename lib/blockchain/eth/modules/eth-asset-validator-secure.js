class EthAssetValidatorSecure {
    async createPuzzleSecure (address, puzzleType, plainTextMetrics, metricsHash, params, checkOwner) {
        try {
            let from = this.options.contracts.PuzzleManager.options.from
            let uniqueId = Math.random().toString(36)+Math.random().toString(36);

//            createPuzzle
            console.log('A. CreateSecurePuzzle estimateGas')
            let gas = await this.puzzleManager.methods.CreateSecurePuzzle(address, plainTextMetrics, metricsHash, checkOwner, uniqueId).estimateGas()
            console.log('B. CreateSecurePuzzle send', gas)
            let result = await this.puzzleManager.methods.CreateSecurePuzzle(address, plainTextMetrics, metricsHash, checkOwner, uniqueId).send({
                from,
                gas
            })
            console.log('C. getEventForUniqueId')
            let event = await this.getEventForUniqueId(uniqueId)
            console.log('D. event', JSON.stringify(event))
            if (!event.returnValues) {
                event.returnValues=event.returnValues
            }
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
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.PushSecureMetrics(puzzleId, metrics).estimateGas()
            let result = await this.puzzleManager.methods.PushSecureMetrics(puzzleId, metrics).send({
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

    async compareSecureMetrics (puzzleId, address) {
        try {
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.CompareSecureMetrics(puzzleId, address).estimateGas()
            let result = await this.puzzleManager.methods.CompareSecureMetrics(puzzleId, address).call({
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

}

module.exports = EthAssetValidatorSecure
