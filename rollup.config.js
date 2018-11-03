const buble = require('rollup-plugin-buble')
import resolve from 'rollup-plugin-node-resolve';
const typescript = require('rollup-plugin-typescript')

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-auth-0-plugin.esm.js',
      format: 'es'
    },
    plugins: [
      typescript(),
      resolve(),
      buble()
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-auth-0-plugin.js',
      format: 'umd',
      name: 'AuthService'
    },
    plugins: [
      typescript(),
      resolve(),
      buble(),
    ]
  }
]
