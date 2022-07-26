const { InlineKeyboard } = require("grammy")
const Url = require("../../../database/UrlSchema.js")
const editOrSend = require("../../editOrSend.js")

const buildAnalysis = require("../helper/analysis.js")
const buildMeta = require("../helper/meta.js")
const buildCategory = require("../helper/category.js")

const filterUrl = data => {
  let keyboard = new InlineKeyboard()
  let query = ""

  switch ( data ) {
    case "url-analysis":
      query = "analytic_result"
      keyboard.text("Summary", "url-summary")
      keyboard.text("Meta Tag", "url-meta").row()
      keyboard.text("Categories", "url-category")
      keyboard.text("Related Link", "url-related")
      break

    case "url-meta":
      query = "meta"
      keyboard.text("Analysis", "url-analysis")
      keyboard.text("Summary", "url-summary").row()
      keyboard.text("Categories", "url-category")
      keyboard.text("Related Link", "url-related")
      break

    case "url-category":
      query = "categories"
      keyboard.text("Analysis", "url-analysis")
      keyboard.text("Meta Tag", "url-meta").row()
      keyboard.text("Summary", "url-summary")
      keyboard.text("Related Link", "url-related")
      break

    case "url-related":
      query = "related_link"
      keyboard.text("Analysis", "url-analysis")
      keyboard.text("Meta Tag", "url-meta").row()
      keyboard.text("Categories", "url-category")
      keyboard.text("Summary", "url-summary")
      break

    default:
      query = "summary"
      keyboard.text("Analysis", "url-analysis")
      keyboard.text("Meta Tag", "url-meta").row()
      keyboard.text("Categories", "url-category")
      keyboard.text("Related Link", "url-related")
      break;
  }

  return { keyboard, query }
}

const handleUrl = async ( ctx, query, keyboard ) => {
  let chat_id = ctx.msg.chat.id.toString()
  let message_id = ctx.msg.message_id.toString()

  let result = await Url.findOne({ url_id: chat_id + message_id })
  if ( !result ) {
    return await ctx.api.deleteMessage(chat_id, message_id)
  }

  await editOrSend(ctx, result[query], keyboard, "url")
}

const initUrl = async ( ctx, attributes ) => {
  let analysisResult = buildAnalysis(attributes.last_analysis_results)
  let meta = buildMeta(attributes.html_meta)
  let categories = buildCategory(attributes.categories)
  let relatedLink = attributes.outgoing_links.join("\n")

  let time = new Date(attributes.last_analysis_date * 1000).toLocaleString()
  let summary = `Reputation : ${ attributes.reputation }\n`
  summary += `Last Analysis : ${ time }\n`
  summary += `Title : ${ attributes.title }`

  let keyboard = new InlineKeyboard()
    .text("Analysis", "url-analysis")
    .text("Meta Tag", "url-meta").row()
    .text("Categories", "url-category")
    .text("Related Link", "url-related")

  let res = await ctx.reply(summary, { reply_markup: keyboard })
  let id = res.chat.id.toString() + res.message_id.toString()

  let url = new Url({
    url_id: id,
    summary: summary || "Summary Not Found",
    meta: meta || "Meta Not Found",
    categories: categories || "Category Not Found",
    related_link: relatedLink || "Related Links Not Found",
    analytic_result: analysisResult || "Analysis Not Found"
  })

  return url.save()
}

module.exports = { filterUrl, handleUrl, initUrl }
