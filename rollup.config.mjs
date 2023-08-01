import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default ['core', 'webpack', 'vite'].map((pkg) => ({
  input: `packages/${pkg}/index.ts`,
  output: [{
    file: `packages/${pkg}/dist/index.cjs.js`,
    format: 'cjs',
    sourcemap: true,
  },
  {
    file: `packages/${pkg}/dist/index.esm.js`,
    format: 'es',
    sourcemap: true,
  }],
  plugins: [
    resolve(),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      outDir: path.resolve(__dirname, `packages/${pkg}/dist`),
    }),
  ],
}))
