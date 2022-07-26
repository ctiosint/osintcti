const build = meta => {
  let result = ""
  let index = 1
  for ( let key of Object.keys(meta) ) {
    result += `${ index }. ${ key }\n`
    index++
  }
  return result
}

module.exports = build
