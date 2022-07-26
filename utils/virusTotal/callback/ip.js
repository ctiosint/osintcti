const { InlineKeyboard } = require("grammy")
const IpAddress = require("../../../database/IpAddressSchema.js")
const editOrSend = require("../../editOrSend.js")
const buildAnalysis = require("../helper/analysis.js")

const filterIp = ( data ) => {
  let keyboard = new InlineKeyboard()
  let query = ""

  switch ( data ) {
    case "ip-analysis":
      query = "analytic_result"
      keyboard.text("Summary", "ip-summary")
      keyboard.text("Who Is", "ip-who-is")
      break;

    case "ip-who-is":
      query = "whois"
      keyboard.text("Summary", "ip-summary")
      keyboard.text("Analysis", "ip-analysis")
      break

    default:
      query = "summary"
      keyboard.text("Analysis", "ip-analysis")
      keyboard.text("Who Is", "ip-who-is")
      break;
  }

  return { query, keyboard }
}

const handleIp = async ( ctx, query, keyboard ) => {
  let chat_id = ctx.msg.chat.id.toString()
  let message_id = ctx.msg.message_id.toString()

  let result = await IpAddress.findOne({ ip_id: chat_id + message_id })
  if ( !result ) {
    return await ctx.api.deleteMessage(chat_id, message_id)
  }

  await editOrSend(ctx, result[query], keyboard, "ip_address")
}

const initIp = async ( ctx, attributes ) => {
  let analysisResult = buildAnalysis(attributes.last_analysis_results)
  let whois = attributes.whois
  let modifTime = new Date(attributes.last_modification_date * 1000).toLocaleString()

  let summary = `Reputation : ${ attributes.reputation }\n`
  summary += `Last Modification : ${ modifTime }`

  let keyboard = new InlineKeyboard()
    .text("Who Is", "ip-who-is")
    .text("Analysis", "ip-analysis")

  let res = await ctx.reply(summary, { reply_markup: keyboard })
  let id = res.chat.id.toString() + res.message_id.toString()

  let ipAddresses = new IpAddress({
    ip_id: id,
    summary: summary || "Summary Not Found",
    whois: whois || "Who Is Not Found",
    analytic_result: analysisResult || "Analytic Not Found"
  })

  return ipAddresses.save()
}

module.exports = { handleIp, filterIp, initIp }
