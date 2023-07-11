import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import path, { resolve } from 'pathe'
import type { IContext } from '~src/core/context'
import { i18nService } from '~src/services/i18n.service'
import { FileHelper } from '~src/utils/FileHelper'

export * from '~src/type'
export { default } from '~src/core/unplugin'

const template = `{
  "huntersofbook": "read a book",
  "hello": "hello",
  "githubStar": "https://github.com/huntersofbook/huntersofbook",
  "sponsor": "https://github.com/sponsors/productdevbook"
}
`

// The two tests marked with concurrent will be run in parallel
describe('i18n Test', async () => {
  const fileHelper = new FileHelper()
  const templateDir = 'test/.temp/.i18n'
  const exportDir = 'test/.temp/languages'

  let ctx: Awaited<ReturnType<typeof i18nService>>

  beforeAll(async () => {
    ctx = await i18nService({
      options: {
        templateDir,
        exportDir,
        deep: true,
        globs: ['deneme'],
        extensions: ['json'],
        languages: ['tr', 'en', 'ch'],
        resolvedDir: 'deneme',
        root: 'deneme',
        schema: 'schemaEn.json',
      },
    } as Partial<IContext> as IContext)

    await ctx.createFirstTemplate(template)
  })

  afterAll(async () => {
    // await ctx.deleteAllFolders()
    // await ctx.deleteAllFolders(ctx.options.templateDir)
  })

  /* describe('Folder Check', () => {
    test('resolve tests', async () => {
      expect(ctx.options.templateDir).toEqual(resolve('test/.temp/.i18n'))
      expect(ctx.options.exportDir).toEqual(resolve('test/.temp/.languages'))
    })
  }) */

  describe('exists folders', () => {
    test('should return true if .i18n exists', async () => {
      const exists = await fileHelper.exists(templateDir)
      expect(exists).toBe(true)
    })

    test('should return true if .languages exists', async () => {
      const exists = await fileHelper.exists(exportDir)
      expect(exists).toBe(true)
    })
  })

  describe('Localization files', () => {
    const schemaDir = resolve('test/.temp/.i18n/schema.json')

    test('should return true if schema.json exists', async () => {
      const exists = await fileHelper.exists(schemaDir)
      expect(exists).toBe(true)
    })

    test('should exist languages files', async () => {
      const jsonFiles = await ctx.getJsonFiles(exportDir)

      // Expect that there is at least one JSON file
      expect(jsonFiles.length).toBeGreaterThan(0)

      // Check each file
      for (const file of jsonFiles) {
        const filePath = path.join('./test/.temp/languages', file)
        const exists = await fileHelper.exists(filePath)
        expect(exists).toBe(true)
      }
    })
  })
})
