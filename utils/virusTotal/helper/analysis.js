const build = analysis => {
  let analysisResult = ""
  let index = 1

  for ( let key of Object.keys(analysis) ) {
    let name = analysis[key].engine_name
    let stat = analysis[key].result

    let text = `${ index }. ${ name } - ${ stat }\n`
    analysisResult += text
    index++
  }

  return analysisResult
}

module.exports = build
