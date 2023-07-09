import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { resolve } from 'pathe'
import type { IContext } from '~src/core/context'
import { i18nService } from '~src/core/write2'

// The two tests marked with concurrent will be run in parallel
describe('', async () => {
  let ctx: Awaited<ReturnType<typeof i18nService>>

  beforeAll(async () => {
    ctx = await i18nService({
      options: {
        exportDir: 'test/.temp/.languages',
        templateDir: 'test/.temp/.i18n',
        deep: true,
        globs: ['deneme'],
        extensions: ['deneme'],
        languages: ['deneme'],
        resolvedDir: 'deneme',
        root: 'deneme',
        schema: 'deneme',
      },
    } as Partial<IContext> as IContext)

    ctx.checkDirection()
  })

  afterAll(async () => {
    await ctx.deleteFiles()
  })

  test('resolve tests', async () => {
    expect(ctx.options.exportDir).toEqual(resolve('test/.temp/.languages'))
    expect(ctx.options.templateDir).toEqual(resolve('test/.temp/.i18n'))
  })
})
