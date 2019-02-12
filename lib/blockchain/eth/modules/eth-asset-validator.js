class EthAssetValidator {
    async createPuzzle (metrics) {
        try {
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

    async getPuzzleMetrics (puzzleId) {
        try {
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

}

module.exports = EthAssetValidator
