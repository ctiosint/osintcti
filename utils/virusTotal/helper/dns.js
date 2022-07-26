const build = dns => {
  let data = dns.map( item => {
    let typeTtl = item.type + " - " + item.ttl
    let value = item.value
    return `Type & TTL : ${ typeTtl }\nValue : ${ value }`
  })
  return data.join("\n\n")
}

module.exports = build
