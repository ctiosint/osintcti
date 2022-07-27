const User = require("../database/UserSchema.js")
const { InlineKeyboard } = require("grammy")

const engineHandler = async ctx => {
  let text = "Pilihlah salah satu engine dibawah ini: \n Untuk memilih kembali gunakan /engine"
  let keyboard = new InlineKeyboard()
    .text("Virus Total", "virus-total")
    .text("IP Abuse", "ip-abuse").row()
    .text("Etherscan", "ether-scan")

  await ctx.reply(text, { reply_markup: keyboard })
}

const updateEngine = async ( ctx, data ) => {
  let cb = ctx.update.callback_query
  let id = cb.from.id
  let nick = cb.from.first_name

  let exists = await User.findOne({ user_id: id })
  if ( !exists ) {
    let newUser = new User({ user_id: id, name: nick, engine: data })
    return newUser.save()
  } else {
    return await User.findOneAndUpdate({ user_id: id }, { engine: data })
  }
}

module.exports = { engineHandler, updateEngine }
