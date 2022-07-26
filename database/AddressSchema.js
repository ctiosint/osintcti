const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  address_id: String,
  query: String,
  transaction: String,
  internalTransaction: String,
  minedBlock: String,
  erc20: String,
  erc721: String
})

const Address = mongoose.model("Address", addressSchema)
module.exports = Address
