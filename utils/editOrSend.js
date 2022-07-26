const Domain = require("../database/DomainSchema.js")
const Url = require("../database/UrlSchema.js")
const IpAddress = require("../database/IpAddressSchema.js")
const File = require("../database/FileSchema.js")
const Address = require("../database/AddressSchema.js")
const Transaction = require("../database/TransactionSchema.js")

const editOrSend = async ( ctx, text, keyboard, type ) => {
  try {
    await ctx.api.editMessageText(
      ctx.msg.chat.id,
      ctx.msg.message_id,
      text,
      { reply_markup: keyboard }
    )
  } catch (e) {
    try {
      await ctx.api.deleteMessage(ctx.msg.chat.id, ctx.msg.message_id)
      let res = await ctx.reply(text, { reply_markup: keyboard })

      let old = { chat_id: ctx.msg.chat.id, message_id: ctx.msg.message_id }
      let cur = { chat_id: res.msg.chat.id, message_id: res.msg.message_id }
      if ( type ) await updateId(type, old, cur)

    } catch (err) {
      return null
    }
  }
}

const updateId = async ( type, old, cur ) => {
  let oldId = old.chat_id.toString() + old.message_id.toString()
  let newId = cur.chat_id.toString() + cur.message_id.toString()

  switch ( type ) {
    case "domain":
      await Domain.findOneAndUpdate({ domain_id: oldId }, { domain_id: newId })
      break;

    case "url":
      await Url.findOneAndUpdate({ url_id: oldId }, { url_id: newId })
      break;

    case "ip_address":
      await IpAddress.findOneAndUpdate({ ip_id: oldId }, { ip_id: newId })
      break

    case "address":
      await Address.findOneAndUpdate({ address_id: oldId }, { address_id: newId })
      break

    case "transaction":
      await Transaction.findOneAndUpdate({ tx_id: oldId }, { tx_id: newId })
      break

    default:
      await File.findOneAndUpdate({ file_id: oldId }, { file_id: newId })
      break;
  }
}

module.exports = editOrSend
