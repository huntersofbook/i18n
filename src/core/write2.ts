import { existsSync, mkdirSync, rmdirSync } from 'node:fs'
import { resolve } from 'pathe'
import type { IContext } from './context'

export async function i18nService(ctx: IContext, filepath?: string) {
  console.log('mustafa', 123)
  const options = ctx.options

  async function init() {
    options.templateDir = resolve(options.templateDir)
    options.exportDir = resolve(options.exportDir)
  }

  await init()

  // check file
  async function checkDirection() {
    if (!existsSync(ctx.options.templateDir)) {
      mkdirSync(ctx.options.templateDir, {
        recursive: true,
      })
    }

    if (!existsSync(ctx.options.exportDir)) {
      mkdirSync(ctx.options.exportDir, {
        recursive: true,
      })
    }
  }

  async function deleteFiles() {
    if (existsSync(ctx.options.templateDir))
      rmdirSync(ctx.options.templateDir)

    if (existsSync(ctx.options.exportDir))
      rmdirSync(ctx.options.exportDir)
  }

  return {
    checkDirection,
    options,
    deleteFiles,
  }
}
