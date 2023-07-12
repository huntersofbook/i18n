import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import path from 'pathe'

import { exists, getJsonFiles, readFile, writeFile } from '~src/core/utils/FileHelper'
import type { IContext } from '~src/core/context'

import { setupContext } from '~src/core/core'
import { i18nService } from '~src/core/services/i18n.service'

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

/* const mockTempleteData2 = `{
  "message": "bu yeni datadır",
  "date": "${formattedDate}",
  "huntersofbook": "read a book",
  "hello": "hello",
  "githubStar": "https://github.com/huntersofbook/huntersofbook",
  "sponsor": "https://github.com/sponsors/productdevbook"
}
` */

// The two tests marked with concurrent will be run in parallel
describe('i18n Test', async () => {
  const i18nDir = 'test/.temp/.i18n'
  const languagesDir = 'test/.temp/languages'
  const schemaPath = 'test/.temp/.i18n/schema.json'

  // let ctx: Awaited<ReturnType<typeof i18nService>>

  // let ctx: Awaited<ReturnType<typeof i18nService>>

  let ctx: IContext

  beforeAll(async () => {
    const { ctx: _ctx } = setupContext({
      watch: true,
      option: {
        templateDir: i18nDir,
        exportDir: languagesDir,
        deep: true,
        globs: ['test/.temp/.i18n/**/*.json'],
        extensions: ['json'],
        languages: ['tr', 'en', 'ch'],
        schema: 'schemaEn.json',
      },
    })

    await _ctx.bootstrap(mockTempleteData)

    ctx = _ctx

    // await ctx.createStartTemplate(template)
  })

  afterAll(async () => {
    const { deleteAllFolders } = await i18nService(ctx)
    deleteAllFolders()
  })

  describe('Exists folders', () => {
    test('should return true if .i18n exists', async () => {
      const _exists = await exists(i18nDir)
      expect(_exists).toBe(true)
    })

    test('should return true if .languages exists', async () => {
      const _exists = await exists(languagesDir)
      expect(_exists).toBe(true)
    })
  })

  describe('Localization files', () => {
    test('should return true if schema.json exists', async () => {
      const _exists = await exists(schemaPath)
      expect(_exists).toBe(true)
    })

    test('should exist languages files', async () => {
      const jsonFiles = await getJsonFiles(languagesDir)

      // Expect that there is at least one JSON file
      expect(jsonFiles.length).toBeGreaterThan(0)

      // Check each file
      for (const file of jsonFiles) {
        const filePath = path.join(languagesDir, file)
        const _exists = await exists(filePath)
        expect(_exists).toBe(true)
      }
    })
  })

  describe('File Update', () => {
    test('schema.json içeriği ile diğer dosyalar aynı olmalı', async () => {
      const _exists = await exists(schemaPath)
      expect(_exists).toBe(true)

      const readSchemaData = await readFile(schemaPath)

      const jsonFiles = await getJsonFiles(languagesDir)

      if (jsonFiles?.length) {
        for (const file of jsonFiles) {
          const filePath = path.join(languagesDir, file)
          const fileData = await readFile(filePath)

          expect(readSchemaData).toBe(fileData)
        }
      }
    })

    // TODO schema güncellenince diğerleri güncellenmiyor!!! buna bakılacak.
    /* test('schema.json içeriğini değiştir', async () => {
      const _exists = await exists(schemaPath)
      expect(_exists).toBe(true)

      await writeFile(schemaPath, mockTempleteData2)
      const readSchemaData = await readFile(schemaPath)

      const jsonFiles = await getJsonFiles(languagesDir)

      if (jsonFiles?.length) {
        for (const file of jsonFiles) {
          const filePath = path.join(languagesDir, file)
          const fileData = await readFile(filePath)

          expect(readSchemaData).toBe(fileData)
        }
      }
    }) */
  })
})
