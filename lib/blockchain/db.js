const
//    keccak256 = require('js-sha3').keccak256,
    mongoose = require('mongoose')
//    _ = require('lodash')

var UserAddress

function initModels(conn) {
    UserAddress = require('../models/UserAddress').createModel(conn)
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
    
    async setPuzzleParams(address, params) {
        try {
            var userAddress = new UserAddress({address, params})
            await userAddress.save()
        }
        catch (e) {
            console.log("setPuzzle db error", e)
        }
    }
    
    async getPuzzleParams(address) {
        try {
            var userAddress = UserAddress.findOne({address})
            return userAddress
        }
        catch (e) {
            console.log("getPuzzle db error", e)
        }
    }
}

module.exports = Database
