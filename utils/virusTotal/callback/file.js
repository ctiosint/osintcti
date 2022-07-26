const { InlineKeyboard } = require("grammy")
const formatBytes = require("../helper/formatBytes.js")
const editOrSend = require("../../editOrSend.js")
const File = require("../../../database/FileSchema.js")

const filterFile = ( data ) => {
  let keyboard = new InlineKeyboard()
  let query = ""

  switch ( data ) {
    case "fl-analysis":
      query = "analysis"
      keyboard.text("Summary", "fl-summary")
      keyboard.text("Details", "fl-detail")
      break;

    case "fl-detail":
      query = "details"
      keyboard.text("Analysis", "fl-analysis")
      keyboard.text("Summary", "fl-summary")
      break

    default:
      query = "summary"
      keyboard.text("Analysis", "fl-analysis")
      keyboard.text("Details", "fl-detail")
      break;
  }

  return { query, keyboard }
}

const handleFile = async ( ctx, query, keyboard ) => {
  let chat_id = ctx.msg.chat.id.toString()
  let message_id = ctx.msg.message_id.toString()

  let result = await File.findOne({ file_id: chat_id + message_id })
  if ( !result ) {
    return await ctx.api.deleteMessage(chat_id, message_id)
  }

  await editOrSend(ctx, result[query], keyboard, "file")
}

const initFile = async ( ctx, attributes ) => {
  let date = new Date(attributes.last_analysis_date * 1000).toLocaleString()
  let summary = `Name : ${ attributes.meaningful_name }\n`
  summary += `Extension : ${ attributes.type_extension }\n`
  summary += `Last Analysis : ${ date }\n`
  summary += `SHA-256 : ${ attributes.sha256 }`

  let details = `MD5 : ${ attributes.md5 }\n`
  details += `SHA-1 : ${ attributes.sha1 }\n`
  details += `SHA-256 : ${ attributes.sha256 }\n`
  details += `V-Hash : ${ attributes.vhash }\n`
  details += `SSDEEP : ${ attributes.ssdeep }\n`
  details += `TLSH : ${ attributes.tlsh }\n`
  details += `File Type : ${ attributes.type_description }\n`
  details += `Magic : ${ attributes.magic }\n`

  details += attributes.trid.map(item => `TRID : ${ item.file_type } (${ item.probability }%)`).join("\n")
  details += `\nFile Size : ${ formatBytes(attributes.size) }`

  let analysis = ""
  let analysisResult = attributes.last_analysis_results
  for ( let key of Object.keys(analysisResult) ) {
    let elem = analysisResult[key]

    let result = elem.result ? " - " + elem.result : ""
    analysis += `${ elem.engine_name } : ${ elem.category }${ result }\n`
  }

  let keyboard = new InlineKeyboard()
    .text("Analysis", "fl-analysis")
    .text("Details", "fl-detail")

  let res = await ctx.reply(summary, { reply_markup: keyboard })
  let id = res.chat.id.toString() + res.message_id.toString()

  let files = new File({
    file_id: id,
    summary: summary || "Summary Not Found",
    details: details || "Details Not Found",
    analysis: analysis || "Analysis Not Found"
  })

  return files.save()
}

module.exports = { initFile, handleFile, filterFile }
