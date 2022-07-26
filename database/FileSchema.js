const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
  file_id: String,
  details: String,
  analysis: String,
  summary: String
})

const File = mongoose.model("File", fileSchema)
module.exports = File
