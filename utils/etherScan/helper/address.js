const fetch = require("../../fetch.js")

const getBalance = async query => {
  let balance = await fetch("https://api-goerli.etherscan.io/api", {
    module: "account",
    action: "balance",
    address: query,
    tag: "latest",
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if (
    !balance || balance.status === "0"
  ) return null

  return balance.result
}

const getTransaction = async ( query ) => {
  let transaction = await fetch("https://api.etherscan.io/api", {
    module: "account",
    action: "txlist",
    address: query,
    page: 1,
    offset: 99,
    sort: "desc",
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if (
    !transaction || transaction.status === "0"
  ) return null
  
  let raw = []
  let result = transaction.result.map((item, index) => {
    let time = new Date( item.timeStamp * 1000 ).toLocaleString()
    let text = `Hash : ${ item.hash }\n`
    text += `Time : ${ time }\n`
    text += `From : ${ item.from }\n`
    text += `To : ${ item.to }\n`
    text += `Value : ${ item.value } Wei\n`
    text += `Gas Price : ${ item.gasPrice } Wei`
    raw.push({
      Hash: item.hash,
      Time: time,
      From: item.from,
      To: item.to,
      Value: item.value,
      "Gas Price": item.gasPrice
    })

    return index >= 10 ? "" : text
  })

  return {
    text: result.filter(itm => itm !== "").join("\n\n"),
    raw
  }
}

const getInternalTransaction = async ( query ) => {
  let internal = await fetch("https://api.etherscan.io/api", {
    module: "account",
    action: "txlistinternal",
    address: query,
    page: 1,
    offset: 99,
    sort: "desc",
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if (
    !internal || internal.status === "0"
  ) return null
  
  let raw = []
  let result = internal.result.map((item, index) => {
    let time = new Date( item.timeStamp * 1000 ).toLocaleString()
    let text = `Hash : ${ item.hash }\n`
    text += `Block : ${ item.blockNumber }\n`
    text += `Time : ${ time }\n`
    text += `From : ${ item.from }\n`
    text += `To : ${ item.to }\n`
    text += `Value : ${ item.value } Wei`
    raw.push({
      Hash: item.hash,
      Block: item.blockNumber,
      Time: time,
      From: item.from,
      To: item.to,
      Value: item.value
    })
    return index >= 10 ? "" : text
  })

  return { 
    text: result.filter(itm => itm !== "").join("\n\n"), 
    raw 
  }
}

const getMinedBlock = async ( query ) => {
  let minedBlock = await fetch("https://api.etherscan.io/api", {
    module: "account",
    action: "getminedblocks",
    address: query,
    blocktype: "blocks",
    page: 1,
    offset: 99,
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if (
    !minedBlock || minedBlock.status === "0"
  ) return null

  let raw = []
  let result = minedBlock.result.map((item, index) => {
    let time = new Date( item.timeStamp * 1000 ).toLocaleString()
    let text = `Block : ${ item.blockNumber }\n`
    text += `Reward : ${ item.blockReward } Wei\n`
    text += `Time : ${ time }`
    raw.push({
      Block: item.blockNumber,
      Reward: item.blockReward,
      Time: time
    })
    return index >= 10 ? "" : text
  })

  return {
    text: result.filter(itm => itm !== "").join("\n\n"), 
    raw 
  }
}

const getErc20Token = async ( query ) => {
  let erc20 = await fetch("https://api.etherscan.io/api", {
    module: "account",
    action: "tokentx",
    address: query,
    page: 1,
    offset: 99,
    sort: "desc",
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if (
    !erc20 || erc20.status === "0"
  ) return null
  
  let raw = []
  let result = erc20.result.map((item,index) => {
    let time = new Date( item.timeStamp * 1000 ).toLocaleString()
    let text = `Hash : ${ item.hash }\n`
    text += `Time : ${ time }\n`
    text += `From : ${ item.from }\n`
    text += `To : ${ item.to }\n`
    text += `Value : ${ item.value } Wei\n`
    text += `Token : ${ item.tokenName }`
    raw.push({
      Hash: item.hash,
      Time: time,
      From: item.from,
      To: item.to,
      Value: item.value,
      Token: item.tokenName
    })
    return index >= 10 ? "" : text
  })

  return { 
    text: result.filter(itm => itm !== "").join("\n\n"), 
    raw 
  }
}

const getErc721Token = async ( query ) => {
  let erc721 = await fetch("https://api.etherscan.io/api", {
    module: "account",
    action: "tokennfttx",
    address: query,
    page: 1,
    offset: 99,
    sort: "desc",
    apikey: process.env.ETHERSCAN_APIKEY
  })

  if (
    !erc721 || erc721.status === "0"
  ) return null
  
  let raw = []
  let result = erc721.result.map((item, index) => {
    let time = new Date( item.timeStamp * 1000 ).toLocaleString()
    let text = `Hash : ${ item.hash }\n`
    text += `Time : ${ time }\n`
    text += `From : ${ item.from }\n`
    text += `To : ${ item.to }\n`
    text += `Token ID : ${ item.tokenID }\n`
    text += `Token : ${ item.tokenName } (${ item.tokenSymbol })`
    raw.push({
      Hash: item.hash,
      Time: time,
      From: item.from,
      To: item.to,
      "Token ID": item.tokenID,
      Token: item.tokenName + ` (${ item.tokenSymbol })`
    })
    return index >= 10 ? "" : text
  })

  return { 
    text: result.filter(itm => itm !== "").join("\n\n"), 
    raw
  }
}

module.exports = {
  getTransaction,
  getInternalTransaction,
  getMinedBlock,
  getErc20Token,
  getErc721Token,
  getBalance
}
