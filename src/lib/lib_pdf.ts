export const setPdfLangFont = async (doc, lang) => {
  if(lang === 'en') return null
  const fontName = `PdfFont_${lang}`
  const fontData = await import(`@/assets/font/${fontName}.json`)

  const addFont = async type => {
    doc.addFileToVFS(`${fontName}-${type}.ttf`, fontData[type])
    doc.addFont(`${fontName}-${type}.ttf`, fontName, type)
  }

  await addFont('bold')
  await addFont('normal')

  doc.setFont(fontName)
  return fontName

}