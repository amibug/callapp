import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/callapp.js',
  output: {
    file: 'build/callapp.umd.min.js',
    format: 'umd',
    name: 'callapp'
  },
  plugins: [
    postcss({
      extensions: ['.less']
    }),
    terser()
  ]
}
