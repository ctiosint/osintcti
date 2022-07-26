const mongoose = require("mongoose")

const IpAddressSchema = new mongoose.Schema({
  ip_id: String,
  summary: String,
  analytic_result: String,
  whois: String
})

const IpAddress = mongoose.model("IP_Address", IpAddressSchema)
module.exports = IpAddress
