const fetch = require("../fetch.js")

const processQuery = async ( ctx, query ) => {
  let data = await fetch(
    "https://api.abuseipdb.com/api/v2/check",
    { ipAddress: query },
    { Accept: "application/json", Key: process.env.IP_ABUSE_APIKEY }
  )

  if ( !data ) {
    return await ctx.reply(`Tidak menemukan hasil apapun dari keyword ${ query }!!`)
  }

  let text = `IP Address : ${ data.data.ipAddress }\n`
  text += `Public : ${ data.data.isPublic ? "Yes" : "No" }\n`
  text += `IP Version : ${ data.data.ipVersion }\n`
  text += `Whitelisted : ${ data.data.isWhitelisted ? "Yes" : "No" }\n`
  text += `Abuse Confidence Score : ${ data.data.abuseConfidenceScore }\n`
  text += `Country Code : ${ data.data.countryCode ? data.data.countryCode : "Empty" }\n`
  text += `Usage Type : ${ data.data.usageType }\n`
  text += `ISP : ${ data.data.isp }\n`
  text += `Domain : ${ data.data.domain ? data.data.domain : "Empty" }\n`
  text += `Host : ${ data.data.hostnames.join(", ") }\n`
  text += `Total Report : ${ data.data.totalReports }\n`
  text += `Distinct User : ${ data.data.numDistinctUsers }\n`
  text += `Last Reported : ${ new Date(data.data.lastReportedAt).toLocaleString("en-US") }`

  await ctx.reply(text)
}
module.exports = processQuery
