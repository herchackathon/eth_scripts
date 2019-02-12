const mongoose = require('mongoose')
var Schema = mongoose.Schema

/** @title Schema UserAddress
 * @param {String} address 0xaddress
 * @param {String} params params
 */

var userAddressSchema = new Schema({
    address: { type: String, required: true },
    params: { type: String, required: true }
})

module.exports.createModel = conn => {
    return conn.model('UserAddress', userAddressSchema)
}
