const build = attributes => {
  let creationDate = new Date(attributes.creation_date * 1000).toLocaleString()
  let lastUpdate = new Date(attributes.last_update_date * 1000).toLocaleString()
  let lastModification = new Date(attributes.last_modification_date * 1000).toLocaleString()
  let registrar = attributes.registrar

  let summary = `Registrar : ${ registrar }\n`
  summary += `Creation : ${ creationDate }\n`
  summary += `Last Update : ${ lastUpdate }\n`
  summary += `Last Modification : ${ lastModification }`

  return summary
}

module.exports = build
