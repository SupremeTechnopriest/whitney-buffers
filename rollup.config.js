import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import progress from 'rollup-plugin-progress'
import size from 'rollup-plugin-bundle-size'
import visualizer from 'rollup-plugin-visualizer'
import minify from 'rollup-plugin-babel-minify'
import { outputFiles } from './package.json'

export default outputFiles.map(f => ({
  input: f.input,
  output: {
    name: 'wb',
    file: f.output,
    format: f.format,
    sourceMap: true
  },
  plugins: [
    resolve({ module: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    minify({ comments: false }),
    progress(),
    size(),
    visualizer()
  ]
}))
