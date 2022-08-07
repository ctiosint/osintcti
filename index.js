require("dotenv").config()

const { Bot, InlineKeyboard } = require("grammy")

const processVirusTotal = require("./utils/virusTotal/index.js")
const processIpAbuse = require("./utils/ipAbuse/index.js")
const processEtherscan = require("./utils/etherScan/index.js")

const { handleDomain, filterDomain } = require("./utils/virusTotal/callback/domain.js")
const { handleIp, filterIp } = require("./utils/virusTotal/callback/ip.js")
const { handleFile, filterFile } = require("./utils/virusTotal/callback/file.js")
const { handleUrl, filterUrl } = require("./utils/virusTotal/callback/url.js")

const { handleAddress, filterAddress } = require("./utils/etherScan/callback/address.js")
const { handleTransaction, filterTransaction } = require("./utils/etherScan/callback/transaction.js")

const processDownload = require("./utils/exportExcel.js")
const editOrSend = require("./utils/editOrSend.js")

const db = require("./database/index.js")
const User = require("./database/UserSchema.js")

const startHandler = require("./bot/start.js")
const { engineHandler, updateEngine } = require("./bot/engine.js")

const bot = new Bot(process.env.TOKEN)


bot.command("start", async ctx => {
  let id = ctx.msg.from.id
  let name = ctx.msg.from.first_name

  let isExists = await User.findOne({ user_id: id })
  if ( !isExists ) {
    let newUser = new User({ user_id: id, name, engine: "" })
    newUser.save()
  }

  let text = `Halo ${ name }, selamat datang!!\nJangan lupa untuk membaca `
  text += "sedikit panduan dibawah tentang cara menggunakanku.\n\n"

  text += "Command Available :\n"
  text += "1. /start - Gunakan command ini untuk menampilkan pesan ini.\n"
  text += "2. /engine - Command yang digunakan untuk mengganti engine.\n\n"

  text += "Note :\n"
  text += "Jika kamu usai memasukkan keyword tetapi bot merespon dengan "
  text += "respon yang tidak kamu harapkan, maka sebaiknya "
  text += "kamu mengecek ulang apakah keyword yang kamu masukkan itu telah benar."
  
  text += "Keterangan Tools:\n"
  text += "Virus Total = digunakan untuk pencarian informasi threat actor."
  text += "IPAbuse = digunakan untuk pencarian informasi IP atau domain malicious."
  text += "EtherScan = digunakan untuk pencarian informasi malicious cryptocurrency address"

  return await startHandler(ctx, text)
})

bot.command("engine", async ctx => {
  return await engineHandler(ctx)
})

bot.on("message:text", async ctx => {
  let user = await User.findOne({ user_id: ctx.msg.from.id })

  if ( !user || !user.engine ) {
    let text = "Kamu belum memilih engine.\nPilih salah satu engine dibawah ini :"
    return await startHandler(ctx, text)
  }

  if ( user.engine === "ip-abuse" ) return await processIpAbuse(ctx, ctx.msg.text)
  if ( user.engine === "virus-total" ) return await processVirusTotal(ctx, ctx.msg.text)
  if ( user.engine === "ether-scan" ) return await processEtherscan(ctx, ctx.msg.text)
})

bot.on("callback_query", async ( ctx, next ) => {
  let data = ctx.update.callback_query.data

  if ( data.includes("dl") ) {
    return await processDownload(ctx)
  }

  await ctx.answerCallbackQuery()

  if ( ["ip-abuse", "ether-scan", "virus-total"].includes(data) ) {
    await updateEngine(ctx, data)

    let engine = data.split("-")
    engine = engine.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ")

    let text = `${ engine } engine telah aktif..\nMasukkan keyword untuk discan.`
    return await editOrSend(ctx, text)
  }

  if ( data.includes("dom") ) {
    let { query, keyboard } = filterDomain(data)
    return await handleDomain(ctx, query, keyboard)
  }

  if ( data.includes("ip") ) {
    let { query, keyboard } = filterIp(data)
    return await handleIp(ctx, query, keyboard)
  }

  if ( data.includes("url") ) {
    let { query, keyboard } = filterUrl(data)
    return await handleUrl(ctx, query, keyboard)
  }

  if ( data.includes("fl") ) {
    let { query, keyboard } = filterFile(data)
    return await handleFile(ctx, query, keyboard)
  }

  if ( data.includes("adr") ) {
    let { query, keyboard } = filterAddress(data)
    return await handleAddress(ctx, query, keyboard)
  }

  if ( data.includes("tx") ) {
    let { query, keyboard } = filterTransaction(data)
    return await handleTransaction(ctx, query, keyboard)
  }

})

bot.catch(async err => {
  if ( !process.env.ADMIN_ID ) return null
  console.error(err)
})

db.connect()
bot.start({ drop_pending_updates: true })
