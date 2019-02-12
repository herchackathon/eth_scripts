class AssetValidator {
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

    async getPuzzleMetrics (puzzleId) {
        return await this.activeChain.getPuzzleMetrics(puzzleId)
    }
}

module.exports = AssetValidator
