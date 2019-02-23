const mongoose = require('mongoose')
var Schema = mongoose.Schema

/** @title Schema GamePuzzle
 * @param {String} address 0xaddress
 * @param {String} params params
 */

var gamePuzzleSchema = new Schema({
    puzzleId: { type: String, required: true },
    params: { type: String, required: true }
})

module.exports.createModel = conn => {
    return conn.model('GamePuzzle', gamePuzzleSchema)
}
