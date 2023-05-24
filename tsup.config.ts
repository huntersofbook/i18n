import type { Options } from 'tsup'

import pkg from './package.json'

const external = [
  ...Object.keys(pkg.dependencies || {}),
]

export default <Options>{
  entryPoints: ['src/*.ts'],
  outDir: 'dist',
  target: 'node18',
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
  external,
}
