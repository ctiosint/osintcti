const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  user_id: Number,
  name: String,
  engine: String
})

const User = mongoose.model("User", userSchema)
module.exports = User
