const
//    keccak256 = require('js-sha3').keccak256,
    mongoose = require('mongoose')
//    _ = require('lodash')

var UserAddress
var GamePuzzle

function initModels(conn) {
    UserAddress = require('../models/UserAddress').createModel(conn)
    GamePuzzle = require('../models/GamePuzzle').createModel(conn)
}

class Database {
    constructor() {
    }
    
    async connect(url) {
        try {
            var conn = await mongoose.createConnection(url, { useNewUrlParser: true })
    
            initModels(conn)
    
    //        await mongoose.connect(url, { useNewUrlParser: true })
        }
        catch (e) {
            console.log("Can't connect to db", e)
        }
    }
    
    async setPuzzleParams (address, params) {
        try {
            var userAddress = new UserAddress({address, params})
            await userAddress.save()
        }
        catch (e) {
            console.log("setPuzzle db error", e)
        }
    }
    
    async getPuzzleParams (address) {
        try {
            var userAddress = UserAddress.findOne({address})
            return userAddress
        }
        catch (e) {
            console.log("getPuzzle db error", e)
            return {
                err: e
            }
        }
    }

    async setGamePuzzle (puzzle) {
        try {
            var puzzleId = puzzle.puzzleId
            
//            var a = await GamePuzzle.findOne({puzzleId})
            await GamePuzzle.deleteMany({puzzleId})
//            var b = await GamePuzzle.findOne({puzzleId})

            var gamePuzzle = new GamePuzzle(puzzle)
            await gamePuzzle.save()
        }
        catch (e) {
            console.log("setGamePuzzle db error", e)
        }
    }

    async getGamePuzzle (puzzleId) {
        try {
            var gamePuzzle = await GamePuzzle.findOne({puzzleId})
            return gamePuzzle
        }
        catch (e) {
            console.log("getGamePuzzle db error", e)
            return {
                err: e
            }
        }
    }
}

module.exports = Database
