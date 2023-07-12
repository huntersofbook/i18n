import { resolve } from 'pathe'
import Debug from 'debug'
import type { IContext } from '../context'
import { createDirectory, deleteDirectory, exists, readFile, writeFile } from '~src/core/utils/FileHelper'

const debug = Debug('unplugin-i18n-watch:write')

const currentDate = new Date()
const formattedDate = `${currentDate.toLocaleDateString()} - ${currentDate.toLocaleTimeString()}`
const mockTempleteData = `{
  "date": "${formattedDate}",
  "huntersofbook": "read a book",
  "hello": "hello",
  "githubStar": "https://github.com/huntersofbook/huntersofbook",
  "sponsor": "https://github.com/sponsors/productdevbook"
}
`

export async function i18nService(ctx: IContext, filepath?: string) {
  // shema içinde json olacak
  // schema delete basınca ne yapacak
  // contexti testin içine import edilecek +++
  const options = ctx.options

  options.templateDir = resolve(options.templateDir) // 'test/.temp/.i18n'
  options.exportDir = resolve(options.exportDir) // 'test/.temp/.languages'

  const languages = ctx.options.languages
  debug('languages', languages)

  async function createStarterTemplate(_template = mockTempleteData) {
    const templateDir = ctx.options.templateDir
    const exportDir = ctx.options.exportDir

    const schemaPath = `${templateDir}/schema.json`

    if (!await exists(templateDir))
      await createDirectory(templateDir)

    // Schema.json
    await writeFile(schemaPath, _template)

    if (!await exists(exportDir))
      await createDirectory(exportDir)

    // Languages
    options.languages?.forEach(async (lang) => {
      await writeFile(`${exportDir}/${lang}.json`, _template)
    })
  }

  async function deleteAllFolders() {
    const templateDir = ctx.options.templateDir
    const exportDir = ctx.options.exportDir

    if (await exists(templateDir))
      await deleteDirectory(templateDir)

    if (await exists(exportDir))
      await deleteDirectory(exportDir)
  }

  async function updatei18nTheme(path: any) {
    /* const templateDir = ctx.options.templateDir
    const exportDir = ctx.options.exportDir */

    // Değişen dosya datasını al
    const updatedSchemaData = await readFile(path)

    createStarterTemplate(updatedSchemaData)

    // yeni datalarla kaydetme işlemi yapılacak

    // TODO değişen dosyayı öğren, eğer schema dosyası ise diğer dil dosyalarına da güncelle,
    // TODO bir dil dosyası güncellenince diğerlerini güncelleme
    // eğer bir dil dosyasında key silinince diğerlerinden de silinecek mi
    // bir dil dosyası silinince ne olacak
    // .18n klasörü altında klasör yapısı yapılınca diğer dilleri de klasör altına alacak mı?
    // .18n dizininde eğer klasörler varsa schema dosyası olmuycak.
    // schema.json dosya adı değiştirilirse ne olacak?
  }

  return {
    options,
    createStarterTemplate,
    deleteAllFolders,
    updatei18nTheme,
  }
}
