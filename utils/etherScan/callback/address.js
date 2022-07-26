const { InlineKeyboard } = require("grammy")
const Address = require("../../../database/AddressSchema.js")
const editOrSend = require("../../editOrSend.js")

const {
  getTransaction,
  getInternalTransaction,
  getMinedBlock,
  getErc20Token,
  getErc721Token
} = require("../helper/address.js")

const filterAddress = ( data ) => {
  let query = ""
  let keyboard = new InlineKeyboard()

  switch ( data ) {
    case "adr-internal":
      query = "internalTransaction"
      keyboard.text("Transaction", "adr-transaction")
      keyboard.text("Mined Block", "adr-mined").row()
      keyboard.text("ERC20", "adr-erc20")
      keyboard.text("ERC721", "adr-erc721").row()
      break;

    case "adr-mined":
      query = "minedBlock"
      keyboard.text("Internal Trx", "adr-internal")
      keyboard.text("Transaction", "adr-transaction").row()
      keyboard.text("ERC20", "adr-erc20")
      keyboard.text("ERC721", "adr-erc721").row()
      break

    case "adr-erc20":
      query = "erc20"
      keyboard.text("Internal Trx", "adr-internal")
      keyboard.text("Mined Block", "adr-mined").row()
      keyboard.text("Transaction", "adr-transaction")
      keyboard.text("ERC721", "adr-erc721").row()
      break

    case "adr-erc721":
      query = "erc721"
      keyboard.text("Internal Trx", "adr-internal")
      keyboard.text("Mined Block", "adr-mined").row()
      keyboard.text("ERC20", "adr-erc20")
      keyboard.text("Transaction", "adr-transaction").row()
      break

    default:
      query = "transaction"
      keyboard.text("Internal Trx", "adr-internal")
      keyboard.text("Mined Block", "adr-mined").row()
      keyboard.text("ERC20", "adr-erc20")
      keyboard.text("ERC721", "adr-erc721").row()
      break;
  }

  keyboard.text("Export Excel", "dl")
  return { query, keyboard }
}

const handleAddress = async ( ctx, query, keyboard ) => {
  let chat_id = ctx.msg.chat.id.toString()
  let message_id = ctx.msg.message_id.toString()

  let result = await Address.findOne({ address_id: chat_id + message_id })
  if ( !result ) {
    return await ctx.api.deleteMessage(chat_id, message_id)
  }

  await editOrSend(ctx, result[query], keyboard, "address")
}

const initAddress = async ( ctx, query ) => {
  let transaction = await getTransaction(query)

  if ( !transaction || !transaction?.text ) {
    let text = "Tidak dapat menemukan hasil apapun dari address " + query
    return await ctx.reply(text)
  }

  let internalTransaction = await getInternalTransaction(query)
  let minedBlock = await getMinedBlock(query)
  let erc20 = await getErc20Token(query)
  let erc721 = await getErc721Token(query)

  if ( !internalTransaction && !minedBlock && !erc20 && !erc721 ) {
    let text = "Tidak dapat menemukan hasil apapun dari address " + query
    return await ctx.reply(text)
  }

  let keyboard = new InlineKeyboard()
    .text("Internal Trx", "adr-internal")
    .text("Mined Block", "adr-mined").row()
    .text("ERC20", "adr-erc20")
    .text("ERC721", "adr-erc721").row()
    .text("Export Excel", "dl")


  let res = await ctx.reply(transaction.text, { reply_markup: keyboard })
  let ids = res.chat.id.toString() + res.message_id.toString()

  let addresses = new Address({
    address_id: ids,
    query: query,
    transaction: transaction?.text || "Transaction Not Found",
    internalTransaction: internalTransaction?.text || "Internal Transaction Not Found",
    minedBlock: minedBlock?.text || "Mined Block Not Found",
    erc20: erc20?.text || "ERC20 Token Not Found",
    erc721: erc721?.text || "ERC721 Token Not Found"
  })

  return addresses.save()
}

module.exports = {
  filterAddress,
  handleAddress,
  initAddress
}
