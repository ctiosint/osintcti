const { InlineKeyboard } = require("grammy")

const startHandler = async ( ctx, text ) => {
  let keyboard = new InlineKeyboard()
    .text("Virus Total", "virus-total")
    .text("IP Abuse", "ip-abuse").row()
    .text("Etherscan", "ether-scan")

  await ctx.reply(text, { reply_markup: keyboard })
}

module.exports = startHandler
