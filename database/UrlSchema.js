const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
  url_id: String,
  summary: String,
  meta: String,
  analytic_result: String,
  categories: String,
  related_link: String
})

const Url = mongoose.model("Url", urlSchema)
module.exports = Url
