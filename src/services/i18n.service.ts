import { resolve } from 'pathe'
import Debug from 'debug'
import type { IContext } from '../core/context'
import { FileHelper } from '~src/utils/FileHelper'

const debug = Debug('unplugin-i18n-watch:write')

export async function i18nService(ctx: IContext, filepath?: string) {
  // shema içinde json olacak
  // schema delete basınca ne yapacak
  // contexti testin içine import edilecek
  const options = ctx.options
  const fileHelper = new FileHelper()

  async function init() {
    // templateDir: 'test/.temp/.i18n'
    options.templateDir = resolve(options.templateDir)
    // exportDir: 'test/.temp/.languages'
    options.exportDir = resolve(options.exportDir)

    const languages = ctx.options.languages
    debug('languages', languages)
  }

  await init()

  /* async function createFolders() {
    await fileHelper.createDirectory(ctx.options.templateDir)
    await fileHelper.createDirectory(ctx.options.exportDir)
  } */

  async function createFirstTemplate(template: any) {
    const templateDir = ctx.options.templateDir
    const exportDir = ctx.options.exportDir
    const schemaPath = `${templateDir}/schema.json`

    if (!await fileHelper.exists(templateDir))
      await fileHelper.createDirectory(templateDir)

    // Schema.json file
    await fileHelper.writeFile(schemaPath, template)

    if (!await fileHelper.exists(exportDir))
      await fileHelper.createDirectory(exportDir)

    // Language files
    options.languages?.forEach(async (lang) => {
      await fileHelper.writeFile(`${exportDir}/${lang}.json`, template)
    })
  }

  async function deleteAllFolders() {
    const templateDir = ctx.options.templateDir
    const exportDir = ctx.options.exportDir

    if (await fileHelper.exists(templateDir))
      await fileHelper.deleteDirectory(templateDir)

    if (await fileHelper.exists(exportDir))
      await fileHelper.deleteDirectory(exportDir)
  }

  async function getJsonFiles(dir: string) {
    const files = await fileHelper.readDir(dir)
    return files.filter(file => file.endsWith('.json'))
  }

  return {
    options,
    createFirstTemplate,
    deleteAllFolders,
    getJsonFiles,
  }
}
