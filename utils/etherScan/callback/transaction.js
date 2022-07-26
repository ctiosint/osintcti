const { InlineKeyboard } = require("grammy")
const Transaction = require("../../../database/TransactionSchema.js")

const editOrSend = require("../../editOrSend.js")
const hexaToDec = require("../helper/hexaToDec.js")

const {
  getTransaction,
  getReceipt,
  getBlock
} = require("../helper/txHash.js")


const filterTransaction = ( data ) => {
  let query = ""
  let keyboard = new InlineKeyboard()
  
  switch ( data ) {
    case "tx-logs":
      query = "logs"
      keyboard.text("Overview", "tx-overview")
      break;

    default:
      query = "overview"
      keyboard.text("Logs", "tx-logs")
      break;
  }

  return { query, keyboard }
}

const handleTransaction = async ( ctx, query, keyboard ) => {
  let chat_id = ctx.msg.chat.id.toString()
  let message_id = ctx.msg.message_id.toString()

  let result = await Transaction.findOne({ tx_id: chat_id + message_id })
  if ( !result ) {
    return await ctx.api.deleteMessage(chat_id, message_id)
  }

  await editOrSend(ctx, result[query], keyboard, "transaction")
}

const initTransaction = async ( ctx, query ) => {
  let transaction = await getTransaction(query)
  if ( !transaction ) {
    let text = "Tidak dapat menemukan hasil apapun dari Tx Hash :\n" + query
    return await ctx.reply(text)
  }

  let receipt = await getReceipt(query)
  let block = await getBlock(transaction.bNumber)

  let result = `Hash : ${ transaction.hash }\n`
  result += `Status : ${ receipt.status }\n`
  result += `Block : ${ hexaToDec(transaction.bNumber) }\n`
  result += `Time : ${ block.time }\n`
  result += `From : ${ transaction.from }\n`
  result += `To : ${ transaction.to }\n`
  result += `Value : ${ transaction.value }\n\n`

  result += `Gas Price : ${ transaction.gasPrice }\n`
  result += `Gas Limit : ${ block.gasLimit }\n`
  result += `Gas Usage : ${ block.gasUsage }\n`
  result += `Gas Base Fee : ${ block.baseFee }\n`
  result += `Gas Max Fee : ${ transaction.maxFee }\n`
  result += `Gas Max Priority Fee : ${ transaction.maxPriority }\n\n`

  result += `Transaction Type : ${ transaction.type }\n`
  result += `Nonce : ${ transaction.nonce }`

  let keyboard = new InlineKeyboard().text("Logs", "tx-logs")
  let res = await ctx.reply(result, { reply_markup: keyboard })
  let ids = res.chat.id.toString() + res.message_id.toString()
  
  let trx = new Transaction({
    tx_id: ids,
    logs: receipt.logs,
    overview: result,
  })

  return trx.save()
}

module.exports = { initTransaction, filterTransaction, handleTransaction }
