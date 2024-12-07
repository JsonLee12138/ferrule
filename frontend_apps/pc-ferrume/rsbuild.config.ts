import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginHtmlMinifierTerser } from 'rsbuild-plugin-html-minifier-terser';

export default defineConfig({
  plugins: [pluginReact(), pluginSass(), pluginHtmlMinifierTerser()],
  source: {
    alias: {
      '@': './src'
    }
  },
  server: {
    open: false
  },
  root: './',
  output: {
    cssModules: {
      auto: (resource) => {
        return resource.includes('.module.');
      },
    },
  },
  html: {
    template: './public/index.html',
    favicon: './public/icon.ico',
    title: 'Json小工具'
  }
});
