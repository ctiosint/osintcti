const mongoose = require("mongoose")

const DomainSchema = new mongoose.Schema({
  domain_id: String,
  whois: String,
  analytic_result: String,
  last_dns: String,
  popularity_ranks: String,
  summary: String
})

const Domain = mongoose.model("Domain", DomainSchema)
module.exports = Domain
