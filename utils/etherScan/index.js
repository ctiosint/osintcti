const { InlineKeyboard } = require("grammy")
const { initAddress } = require("./callback/address.js")
const { initTransaction } = require("./callback/transaction.js")

const { getBlock } = require("./helper/txHash.js")
const hexaToDec = require("./helper/hexaToDec.js")

const Address = require("../../database/AddressSchema.js")
const fetch = require("../fetch.js")

const processQuery = async ( ctx, query ) => {
  if ( query.match( /^0x[a-f0-9]{40}$/i ) ) { // address
    return await initAddress(ctx, query )
  }

  if ( query.match( /^0x[a-f0-9]{64}$/i ) ) { // tx hash
    return await initTransaction(ctx, query)
  }

  if ( isNaN(parseInt(query)) || parseInt(query) < 0 ) {
    return await ctx.reply("Tidak menemukan hasil apapun untuk keyword " + query)
  }

  if ( 
    ("0x" + parseInt(query).toString(16)).match( /^0x[a-f0-9]{6}$/i ) ||
    query.match( /^0[a-f0-9]{6}$/i )
  ) {
    let block = await getBlock("0x" + parseInt(query).toString(16), true)

    if ( !block ) {
      let text = "Tidak dapat menemukan hasil apapun dari Block :\n" + query
      return await ctx.reply(text)
    }

    let text = `Block Height : ${ hexaToDec(block.number) }\n`
    text += `Time : ${ new Date( block.timestamp * 1000 ).toLocaleString() }\n`
    text += `Total Transactions : ${ block.transactions.length }\n`
    text += `Mined By : ${ block.miner }\n`
    text += `Difficulty : ${ hexaToDec(block.difficulty) }\n`
    text += `Total Difficulty : ${ hexaToDec(block.totalDifficulty) }\n`
    text += `Size : ${ hexaToDec(block.size) } bytes\n`
    text += `Gas Used : ${ hexaToDec(block.gasUsed) }\n`
    text += `Gas Limit : ${ hexaToDec(block.gasLimit) }\n`
    text += `Base Fee Per Gas : ${ hexaToDec(block.baseFeePerGas) }\n`
    text += `Extra Data : ${ block.extraData }\n`
    text += `Block Hash : ${ block.hash }\n`
    text += `Parent Hash : ${ block.parentHash }\n`
    text += `SHA3 Uncles : ${ block.sha3Uncles }\n`
    text += `StateRoot : ${ block.stateRoot }\n`
    text += `Nonce : ${ block.nonce }`

    return await ctx.reply(text)
  }

  await ctx.reply("Tidak menemukan hasil apapun untuk keyword " + query)
}

module.exports = processQuery
