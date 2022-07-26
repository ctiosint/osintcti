const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  tx_id: String,
  overview: String,
  logs: String,
})

const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction
