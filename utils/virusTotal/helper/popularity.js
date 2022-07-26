const build = popularity => {
  let result = ""
  for ( let key of Object.keys(popularity) ) {
    let time = new Date(popularity[key].timestamp * 1000).toLocaleString()
    result += `Name : ${ key }\nRank : ${ popularity[key].rank }\nDate : ${ time }\n\n`
  }
  return result
}

module.exports = build
