const build = categories => {
  let result = ""
  let index = 1
  for ( let key of Object.keys(categories) ) {
    result += `${ index }. ${ key } : ${ categories[key] }\n`
    index++
  }
  return result
}

module.exports = build
