import { minimatch } from 'minimatch'
import { slash } from '@antfu/utils'
import { DISABLE_COMMENT } from '~src/core/constants'

export function matchGlobs(filepath: string, globs: string[]) {
  // filePath değişen dosya. ör: en.json
  // globs: 'C:/Users....18n/**/*.json'
  // slash: ters slashları düzeltir
  for (const glob of globs) {
    if (minimatch(slash(filepath), glob))
      return true
  }
  return false
}

export function shouldTransform(code: string) {
  if (code.includes(DISABLE_COMMENT))
    return false
  return true
}
