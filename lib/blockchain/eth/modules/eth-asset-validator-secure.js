class EthAssetValidatorSecure {
    async createPuzzleSecure (address, puzzleType, plainTextMetrics, metricsHash, params, checkOwner) {
        try {
            let from = this.options.contracts.PuzzleManager.options.from
            let uniqueId = Math.random().toString(36)+Math.random().toString(36);

//            createPuzzle
            let gas = await this.puzzleManager.methods.CreateSecurePuzzle(address, plainTextMetrics, metricsHash, checkOwner, uniqueId).estimateGas()
            let result = await this.puzzleManager.methods.CreateSecurePuzzle(address, plainTextMetrics, metricsHash, checkOwner, uniqueId).send({
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

}

module.exports = EthAssetValidatorSecure
