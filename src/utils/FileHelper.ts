import fs from 'node:fs'
import util from 'node:util'

export class FileHelper {
  private _readFile = util.promisify(fs.readFile)
  private _writeFile = util.promisify(fs.writeFile)
  private _mkdir = util.promisify(fs.mkdir)
  private _rmdir = util.promisify(fs.rmdir)
  private _readdir = util.promisify(fs.readdir)

  async readFile(filePath: string): Promise<string> {
    try {
      const data = await this._readFile(filePath, 'utf-8')
      return data
    }
    catch (err) {
      throw new Error(`An error occurred while reading the file: ${err}`)
    }
  }

  async writeFile(filePath: string, data: string): Promise<void> {
    try {
      await this._writeFile(filePath, data, 'utf-8')
    }
    catch (err) {
      throw new Error(`An error occurred while writing the file: ${err}`)
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    try {
      if (!await this.exists(dirPath)) {
        await this._mkdir(dirPath, {
          recursive: true,
        })
      }
    }
    catch (err: any) {
      if (err.code === 'EEXIST') {
        // The directory already exists
        return
      }
      throw new Error(`An error occurred while creating the directory: ${err}`)
    }
  }

  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      if (!await this.exists(dirPath)) {
        await this._rmdir(dirPath, {
          recursive: true,
        })
      }
    }
    catch (err) {
      throw new Error(`An error occurred while deleting the directory: ${err}`)
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await fs.promises.access(path)
      return true
    }
    catch {
      return false
    }
  }

  async readDir(dirPath: string): Promise<string[]> {
    try {
      return await this._readdir(dirPath, 'utf-8')
    }
    catch (err) {
      throw new Error(`An error occurred while reading the file: ${err}`)
    }
  }
}
