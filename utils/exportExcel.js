const { InputFile } = require("grammy")

const path = require("path")
const fs = require("fs")

const ExcelJS = require("exceljs")
const Address = require("../database/AddressSchema.js")
const {
  getTransaction,
  getInternalTransaction,
  getMinedBlock,
  getErc20Token,
  getErc721Token
} = require("./etherScan/helper/address.js")


const exportExcel = async ( ctx, filePath, data ) => {
  let workBook = new ExcelJS.Workbook()

  data.forEach(item => {
    let workSheet = workBook.addWorksheet(item.sheetName)
    workSheet.properties.defaultRowHeight = 18

    let columns = []
    item.value.forEach(items => {
      if ( columns.length ) return
      for ( let key of Object.keys(items) ) columns.push({ header: key, key })
    })

    workSheet.columns = columns
    workSheet.addRows(item.value)

    workSheet.columns.forEach(column => {
      let lengths = column.values.map(v => v.toString().length)
      let clWidth = Math.max(...lengths.filter(v => typeof v === "number"))

      column.width = clWidth + 15
      column.alignment = { vertical: "middle", horizontal: "center" }
      column.font = { name: "Sans Serif" }
    });

    let header = workSheet.getRow(1)
    header.font = { size: 13, bold: true }
    header.commit()
  })

  await workBook.xlsx.writeFile(filePath)
  await ctx.api.sendDocument(ctx.msg.chat.id, new InputFile( filePath ))

  fs.unlink(filePath, err => {
    if ( err ) console.error(err)
    else console.log("Sukses Deleting File")
  })
}

const processDownload = async ( ctx ) => {
  let ids = ctx.msg.chat.id.toString() + ctx.msg.message_id.toString()
  let result = await Address.findOne({ address_id: ids })

  if ( !result ) {
    let text = "Tidak ada data untuk di export"
    return await ctx.answerCallbackQuery(text, { show_alert: true })
  }

  let query = result.query
  let downloadPath = path.join(__dirname, "./")

  let transaction = await getTransaction(query)
  if ( !transaction || !transaction?.raw ) {
    let text = "Tidak ada data untuk di export"
    return await ctx.answerCallbackQuery(text, { show_alert: true })
  }

  let internalTransaction = await getInternalTransaction(query)
  let minedBlock = await getMinedBlock(query)
  let erc20 = await getErc20Token(query)
  let erc721 = await getErc721Token(query)

  if ( !internalTransaction && !minedBlock && !erc20 && !erc721 ) {
    let text = "Tidak ada data untuk di export"
    return await ctx.answerCallbackQuery(text, { show_alert: true })
  }

  let data = []

  if ( transaction?.raw ) data.push({ value: transaction.raw, sheetName: "Trx" })
  if ( internalTransaction?.raw ) data.push({ value: internalTransaction.raw, sheetName: "Internal Trx" })
  if ( minedBlock?.raw ) data.push({ value: minedBlock.raw, sheetName: "Mined Block" })
  if ( erc20?.raw ) data.push({ value: erc20.raw, sheetName: "ERC20" })
  if ( erc721?.raw ) data.push({ value: erc721.raw, sheetName: "ERC721" })

  await ctx.answerCallbackQuery()
  await exportExcel(ctx, `${ downloadPath }${ query }.xlsx`, data)
}

module.exports = processDownload
