import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, test } from 'vitest'
import { useI18n } from '../src'

// The two tests marked with concurrent will be run in parallel
const path = resolve(__dirname, '')
describe('suite', async () => {
  beforeAll(async () => {
    const { onInit } = await useI18n({
      exportDir: resolve(path, 'cache', 'lang'),
      languages: ['en', 'tr'],
      root: 'test',
      templateDir: resolve(path, 'cache', '.i18n'),
    })

    onInit()
  })

  afterAll(async () => {
    // await remove(resolve(path, 'cache'))

  })

  test('test', async () => {

    // expect(true).toBe(true)
  })
})
