import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: {
        distPath: "types"
      },
    },
    {
      format: 'cjs',
      syntax: 'es2021',
    }
  ],
  output: { target: 'node' },
  plugins: [
    // new rspack
  ]
});
