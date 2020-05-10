import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/client/index.js',
  output: {
    file: 'src/public/script.js',
    format: 'iife',
  },
  plugins: [commonjs()]
};
