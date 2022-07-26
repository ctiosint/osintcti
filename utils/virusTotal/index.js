const fetch = require("../fetch.js")
const { initDomain } = require("./callback/domain.js")
const { initIp } = require("./callback/ip.js")
const { initFile } = require("./callback/file.js")
const { initUrl } = require("./callback/url.js")

const processQuery = async ( ctx, query ) => {
  let data = await fetch(
    "https://www.virustotal.com/api/v3/search",
    { query },
    { "x-apikey": process.env.VIRUS_TOTAL_APIKEY }
  )

  if ( !data || !data.data.length ) {
    return await ctx.reply(`Tidak menemukan hasil apapun dari keyword ${ query }!!`)
  }

  let resData = data.data[0]
  let attributes = resData.attributes

  if ( resData.type === "comment" ) {
    return await ctx.reply(attributes.text)
  }

  if ( resData.type === "domain" ) {
    return await initDomain(ctx, attributes)
  }

  if ( resData.type === "ip_address" ) {
    return await initIp(ctx, attributes)
  }

  if ( resData.type === "url" ) {
    return await initUrl(ctx, attributes)
  }

  if ( resData.type === "file" ) {
    return await initFile(ctx, attributes)
  }
}

module.exports = processQuery
