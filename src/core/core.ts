import chokidar from 'chokidar'
import type { Options } from '../type'
import { Context } from './context'

export interface ISetupContext {
  watch?: boolean
  option: Options
}

export function setupContext(data: ISetupContext) {
  const ctx: Context = new Context(data.option)

  if (data.watch)
    ctx.setupWatcher(chokidar.watch(ctx.options.globs))

  return {
    ctx,
  }
}
