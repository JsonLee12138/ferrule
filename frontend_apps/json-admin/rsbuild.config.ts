import { cloneDeep } from 'lodash-es';
import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig, loadEnv, type ProxyConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import AutoImport from 'unplugin-auto-import/rspack';
import Components from 'unplugin-vue-components/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers';
import { proxiesSetup } from './core/proxy';
import { envDefineSetup } from './core/env';

const { parsed } = loadEnv({ prefixes: ['J_'] });

export default defineConfig({
  plugins: [
    pluginSass(),
    pluginVue()
  ],
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          resolvers: [
            ElementPlusResolver(),
            VueHooksPlusResolver()
            // {
            //   imports: ['vue', 'vue-router'],
            //   include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
            //   dts: 'src/auto-imports.d.ts',
            //   resolvers: [VueHooksPlusResolver()],
            // }
          ],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        })
      ],
      optimization: {
        nodeEnv: 'development',
      },
    }
  },
  source: {
    alias: {
      '@': './src'
    },
    define: {
      'import.meta.env': envDefineSetup({
        MODE: process.env.NODE_ENV,
      }, parsed),
      '__DEV__': process.env.NODE_ENV === 'development'
    },
  },
  server: {
    proxy: proxiesSetup(process.env.J_SERVER_PROXIES)
  }
});
