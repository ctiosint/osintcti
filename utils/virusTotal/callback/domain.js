const { InlineKeyboard } = require("grammy")
const Domain = require("../../../database/DomainSchema.js")
const editOrSend = require("../../editOrSend.js")

const buildAnalysis = require("../helper/analysis.js")
const buildDns = require("../helper/dns.js")
const buildSummary = require("../helper/summary.js")
const buildPopularity = require("../helper/popularity.js")

const filterDomain = ( data ) => {
  let keyboard = new InlineKeyboard()
  let query = ""

  switch ( data ) {
    case "dom-who-is":
      query = "whois"
      keyboard.text("Summary", "dom-sum")
      keyboard.text("Analysis", "dom-analysis").row()
      keyboard.text("Dns Record", "dom-last-dns")
      keyboard.text("Popularity Rank", "dom-popularity")
      break;

    case "dom-last-dns":
      query = "last_dns"
      keyboard.text("Who is", "dom-who-is")
      keyboard.text("Analysis", "dom-analysis").row()
      keyboard.text("Summary", "dom-sum")
      keyboard.text("Popularity Rank", "dom-popularity")
      break

    case "dom-popularity":
      query = "popularity_ranks"
      keyboard.text("Who is", "dom-who-is")
      keyboard.text("Analysis", "dom-analysis").row()
      keyboard.text("Last Dns", "dom-last-dns")
      keyboard.text("Summary", "dom-sum")
      break

    case "dom-analysis":
      query = "analytic_result"
      keyboard.text("Who is", "dom-who-is")
      keyboard.text("Summary", "dom-sum").row()
      keyboard.text("Dns Record", "dom-last-dns")
      keyboard.text("Popularity Rank", "dom-popularity")
      break

    default:
      query = "summary"
      keyboard.text("Who is", "dom-who-is")
      keyboard.text("Analysis", "dom-analysis").row()
      keyboard.text("Dns Record", "dom-last-dns")
      keyboard.text("Popularity Rank", "dom-popularity")
      break;
  }

  return { query, keyboard }
}

const handleDomain = async ( ctx, query, keyboard ) => {
  let chat_id = ctx.msg.chat.id.toString()
  let message_id = ctx.msg.message_id.toString()

  let result = await Domain.findOne({ domain_id: chat_id + message_id })
  if ( !result ) {
    return await ctx.api.deleteMessage(chat_id, message_id)
  }

  await editOrSend(ctx, result[query], keyboard, "domain")
}

const initDomain = async ( ctx, attributes ) => {
  let analysisResult = buildAnalysis(attributes.last_analysis_results)
  let dnsRecord = buildDns(attributes.last_dns_records)
  let popularity = buildPopularity(attributes.popularity_ranks)
  let summary = buildSummary(attributes)

  let keyboard = new InlineKeyboard()
    .text("Who Is", "dom-who-is")
    .text("Analysis", "dom-analysis").row()
    .text("Last Dns", "dom-last-dns")
    .text("Popularity", "dom-popularity")

  let res = await ctx.reply(summary, { reply_markup: keyboard })
  let id = res.chat.id.toString() + res.message_id.toString()

  let domain = new Domain({
    domain_id: id,
    whois: attributes.whois || "Who Is Not Found",
    analytic_result: analysisResult || "Analytic Not Found",
    last_dns: dnsRecord || "DNS Not Found",
    popularity_ranks: popularity || "Popularity Not Found",
    summary: summary || "Summary Not Found"
  })

  return domain.save()
}

module.exports = { handleDomain, filterDomain, initDomain }
