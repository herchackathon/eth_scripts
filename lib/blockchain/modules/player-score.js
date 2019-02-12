class BlockchainPlayerScore {
    async getTopScoresCount () {
        return await this.activeChain.getTopScoresCount()
    }

    async getTopScores (index, count) {
        return await this.activeChain.getTopScores(index, count)
    }

    async setScore (score) {
        return await this.activeChain.setScore(score)
    }

    // SECURE [

    async getTopScoresSecureCount () {
        return await this.activeChain.getTopScoresSecureCount()
    }

    async getTopScoresSecure (index, count) {
        return await this.activeChain.getTopScoresSecure(index, count)
    }

    async setScoreSecure (address, score) {
        return await this.activeChain.setScoreSecure(address, score)
    }
    
    // SECURE ]
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
    async wipeScores () {
        return await this.activeChain.wipeScores()
    }
                        
    // PAYOUT ]
}

module.exports = BlockchainPlayerScore
