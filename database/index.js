const mongoose = require("mongoose")

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("DB Connected")
  } catch (e) {
    console.error("DB Error :\n", e)
    return null
  }
}

module.exports = { connect }
