const fetch = require("../../fetch.js")
const hexaToDec = require("./hexaToDec.js")

const getTransaction = async ( query ) => {
  let transaction = await fetch("https://api.etherscan.io/api", {
    module: "proxy",
    action: "eth_getTransactionByHash",
    txhash: query,
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if ( !transaction || !transaction.result ) {
    return null
  }

  let bNumber = transaction.result.blockNumber
  let from = transaction.result.from
  let to = transaction.result.to
  let hash = transaction.result.hash
  let value = hexaToDec(transaction.result.value) + " Wei"
  let gasPrice = hexaToDec(transaction.result.gasPrice) + " Wei"
  let maxFee = hexaToDec(transaction.result.maxFeePerGas) + " Wei"
  let maxPriority = hexaToDec(transaction.result.maxPriorityFeePerGas) + " Wei"
  let type = hexaToDec(transaction.result.type)
  let nonce = hexaToDec(transaction.result.nonce)

  return {
    bNumber, from, to,
    hash, value, gasPrice,
    maxFee, maxPriority, type, nonce
  }
}

const getReceipt = async ( query ) => {
  let receipt = await fetch("https://api.etherscan.io/api", {
    module: "proxy",
    action: "eth_getTransactionReceipt",
    txhash: query,
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if ( !receipt || !receipt.result ) {
    return null
  }

  let logs = receipt.result.logs.map(item => {
    let text = `Index : ${ hexaToDec(item.logIndex) }\n`
    text += `Address : ${ item.address }\n`
    text += `Amount : ${ hexaToDec(item.data) }\n`
    text += `Topics : ${ item.topics.join("\n") }`
    return text
  })

  return {
    logs: logs.filter(itm => itm).join("\n\n") || "Logs Not Found",
    status: hexaToDec(receipt.result.status) === "1" ? "Success" : "Failed"
  }
}

const getBlock = async ( query, flag = false ) => {
  let block = await fetch("https://api.etherscan.io/api", {
    module: "proxy",
    action: "eth_getBlockByNumber",
    tag: query,
    boolean: true,
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if ( !block || !block.result ) {
    return null
  }

  if ( flag ) {
    return block.result
  }

  let time = new Date( block.result.timestamp * 1000 ).toLocaleString()
  let baseFee = hexaToDec(block.result.baseFeePerGas) + " Wei"
  let gasLimit = hexaToDec(block.result.gasLimit) + " Wei"
  let gasUsage = hexaToDec(block.result.gasUsed) + " Wei"

  return {
    time, baseFee,
    gasLimit, gasUsage
  }
}

module.exports = {
  getTransaction,
  getReceipt,
  getBlock
}
