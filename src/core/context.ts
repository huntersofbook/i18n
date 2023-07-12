import type fs from 'node:fs'

import type { UpdatePayload, ViteDevServer } from 'vite'

import { basename } from 'pathe'
import Debug from 'debug'
import { slash, toArray } from '@antfu/utils'
import type { FileInfo, Options, ResolvedOptions } from '../type'
import { i18nService } from './services/i18n.service'
import { matchGlobs } from './utils/utils'
import { resolveOptions } from './options'

const debug = {
  files: Debug('unplugin-i18n-watch:context:files'),
  search: Debug('unplugin-i18n-watch:context:search'),
  hmr: Debug('unplugin-i18n-watch:context:hmr'),
  decleration: Debug('unplugin-i18n-watch:decleration'),
  env: Debug('unplugin-i18n-watch:env'),
}

export interface IContext {
  options: ResolvedOptions
  root: string
  setupViteServer(server: ViteDevServer): void
  setupWatcher(watcher: fs.FSWatcher): void
  onUpdate(path: string): void
  bootstrap(): void
  removeFiles(paths: string | string[]): any
  addFiles(cssFiles?: string | string[]): any
  // searchGlob(): Promise<void>
  findComponent(name: string, type: 'component' | 'directive', excludePaths?: string[]): Promise<FileInfo | undefined>
  setRoot(root: string): void
}

export class Context implements IContext {
  options: ResolvedOptions

  private _componentCSSPaths = new Set<string>()
  private _componentNameMap: Record<string, FileInfo> = {}
  private _server: ViteDevServer | undefined

  constructor(
    private rawOptions: Options,
  ) {
    this.options = resolveOptions(rawOptions, this.root)
    // console.log('this.options', this.options)
  }

  root = process.cwd()

  setRoot(root: string) {
    if (this.root === root)
      return
    debug.env('root', root)
    this.root = root
    this.options = resolveOptions(this.rawOptions, this.root)
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server)
      return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: fs.FSWatcher) {
    const { globs } = this.options
    watcher
      .on('unlink', (path) => {
        console.log(`DELETE: ${path}`)
        if (!matchGlobs(path, globs))
          return

        path = slash(path)
        this.removeFiles(path)
        this.onUpdate(path)
      })

    watcher.on('change', (path) => {
      console.log(`CHANGE: ${path}`)
      if (!matchGlobs(path, globs))
        return
      debug.files('change', path)
      path = slash(path)
      this.onUpdate(path)
    })

    watcher
      .on('add', (path) => {
        console.log(`ADD: ${path}`)
        if (!matchGlobs(path, globs))
          return

        path = slash(path)
        this.addFiles(path)
        this.onUpdate(path)
      })
  }

  async onUpdate(path: string) {
    debug.hmr('update', path)

    const { updatei18nTheme } = await i18nService(this)

    await updatei18nTheme(path)

    if (!this._server)
      return

    const payload: UpdatePayload = {
      type: 'update',
      updates: [],
    }

    if (payload.updates.length)
      this._server.ws.send(payload)
  }

  async bootstrap(template?: any) {
    const { createStarterTemplate } = await i18nService(this)

    await createStarterTemplate(template)
  }

  removeFiles(paths: string | string[]) {
    debug.files('remove', paths)

    const size = this._componentCSSPaths.size
    toArray(paths).forEach(p => this._componentCSSPaths.delete(p))
    if (this._componentCSSPaths.size !== size) {
      this.updateNameMap()
      return true
    }
    return false
  }

  addFiles(cssFiles?: string | string[]) {
    if (cssFiles) {
      debug.files('adding files', cssFiles)
      const paths = Array.isArray(cssFiles) ? cssFiles : [cssFiles]
      const size = this._componentCSSPaths.size
      for (const path of paths)
        this._componentCSSPaths.add(path)
      if (this._componentCSSPaths.size !== size) {
        this.updateNameMap()
        return true
      }
      return false
    }
  }

  private updateNameMap() {
    this._componentNameMap = {}

    Array
      .from(this._componentCSSPaths)
      .forEach((path) => {
        const name = basename(path, '.css')
        if (this._componentNameMap[name]) {
          console.warn(`[unplugin-vue-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`)
          return
        }

        this._componentNameMap[name] = {
          name,
          from: path,
        }
      })
  }

  /* async searchGlob() {
    this.bootstrap()
  } */

  async findComponent(name: string, type: 'component' | 'directive', excludePaths: string[] = []): Promise<FileInfo | undefined> {
    // resolve from fs
    const info = this._componentNameMap[name]
    if (info && !excludePaths.includes(info.from) && !excludePaths.includes(info.from.slice(1)))
      return info
    return undefined
  }
}
