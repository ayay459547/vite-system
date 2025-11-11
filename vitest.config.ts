import { fileURLToPath } from 'node:url'
import type { ConfigEnv } from 'vite'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((env: ConfigEnv) => mergeConfig(
  viteConfig(env),
  defineConfig({
    test: {
      // globals: true, // 可以省略 import describe/it/expect
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
))
