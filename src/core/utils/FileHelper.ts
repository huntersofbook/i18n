import fs from 'node:fs/promises'

const _readFile = fs.readFile
const _writeFile = fs.writeFile
const _mkdir = fs.mkdir
const _rmdir = fs.rmdir
const _readdir = fs.readdir

export async function readFile(filePath: string): Promise<string> {
  try {
    const data = await _readFile(filePath)
    return data.toString('utf-8')
  }
  catch (err) {
    throw new Error(`An error occurred while reading the file: ${err}`)
  }
}

export async function writeFile(filePath: string, data: string): Promise<void> {
  try {
    return await _writeFile(filePath, data, 'utf-8')
  }
  catch (err) {
    throw new Error(`An error occurred while writing the file: ${err}`)
  }
}

export async function createDirectory(dirPath: string): Promise<void> {
  try {
    if (!await exists(dirPath)) {
      await _mkdir(dirPath, {
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

export async function deleteDirectory(dirPath: string): Promise<void> {
  try {
    if (await exists(dirPath)) {
      await _rmdir(dirPath, {
        recursive: true,
      })
    }
  }
  catch (err) {
    throw new Error(`An error occurred while deleting the directory: ${err}`)
  }
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  }
  catch {
    return false
  }
}

export async function readDir(dirPath: string): Promise<string[]> {
  try {
    return await _readdir(dirPath, 'utf-8')
  }
  catch (err) {
    throw new Error(`An error occurred while reading the file: ${err}`)
  }
}

export async function getJsonFiles(dirPath: string) {
  const files = await _readdir(dirPath)
  return files.filter(file => file.endsWith('.json'))
}
