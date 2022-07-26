const axios = require("axios")

async function fetch(endpoint, params, headers) {
  try {
    let result = await axios.get(endpoint, {
      params,
      headers: headers || {}
    })
    return result.data
  } catch (e) {
    return null
  }
}

module.exports = fetch
