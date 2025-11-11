import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/coverage/**',
      '**/node_modules/**', // 忽略 node_modules
      '**/dist/**',
      '**/dist-ssr/**',
      '**/portal/**'
    ]
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  {
    ...pluginCypress.configs.recommended,
    files: [
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}'
    ]
  },
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,
  {
    files: ['**/*.{ts,tsx,js,jsx,vue}'],
    rules: {
      /**
       * 不可使用 namespace
       * v: type interface
       * x: namespace
       */
       '@typescript-eslint/no-namespace': 'warn',
      /**
       * 不可繼承 any unknown
       * v: <T>
       * x: <T extends any>
       */
       '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      /**
       * 類型定義不要為空
       * v: interface Type {...}
       * x: interface Type {}
       */
      '@typescript-eslint/no-empty-object-type': 'off',
      /**
       * 要求使用完整的函數定義
       * v: () => {}
       * x: Function
       */
      '@typescript-eslint/no-unsafe-function-type': 'off',
      /**
       * 要求使用完整的Object定義
       * v: {...}
       * x: Object
       */
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      /**
       * 定義未使用
       */
      '@typescript-eslint/no-unused-vars': 'warn',
      /**
       * 不檢查 any
       * v: num: number = 123
       * x: num: any = 123
       */
      '@typescript-eslint/no-explicit-any': 'off',
      /**
       * 建議使用 cont
       */
      'prefer-const': ['warn'],
      /**
       * 要求使用 === 和 !==
       * v: a === b,
       * x: a == b
       */
      eqeqeq: ['warn', 'always'],
      /**
       * 不要分號
       * v: test
       * x: test;
       */
      semi: ['warn', 'never'],
      /**
       * 使用單引號
       * v: a = 'test'
       * x: a = "test"
       */
      quotes: ['warn', 'single'],
      /**
       * 逗號 前面不空格 後面要空格
       * v: [1, 2, 3]
       * x: [1,2,3]
       */
      'comma-spacing': [
        'warn',
        { 'before': false, 'after': true }
      ],
      /**
       * object 冒號 前面不空格 後面號空格
       * v: { a: 123 }
       * x: { a :123 }
       */
      'key-spacing': [
        'warn',
        { 'beforeColon': false, 'afterColon': true }
      ],
      /**
       * 操作符前後需要加空格: + - * / =
       * v: 1 + 1
       * x: 1+1
       */
      'space-infix-ops': 'warn',
      /**
       * ojbect, array 最後一格不要加上逗號
       * v: { a: 123, b: 456 }, [1, 2, 3]
       * x: { a: 123, b: 456,}, [1, 2, 3,]
       */
      'comma-dangle': ['warn', 'never'],
      /**
       * 行末禁止加空格
       */
      'no-trailing-spaces': 'warn',
      /**
       * 前頭函數 前後空格
       * v: () => {}
       * x: ()=> {}, ()=>{}, () =>{}
       */
      'arrow-spacing': [
        'warn',
        { 'before': true, 'after': true }
      ],
      /**
       * 函數前面加空格
       * v: function() {}
       * x: function () {}
       */
      'space-before-function-paren': ['off', 'never'],
      /**
       * 只有一個參數是否要括號
       * v: (x) => x
       * x: x => x
       */
      'arrow-parens': ['warn', 'as-needed'],
      /**
       * 註解加空白
       * v: // ...註解
       * x: //...註解
       */
      'spaced-comment': [
        'warn',
        'always',
        { block: { balanced: true } }
      ]
    }
  }
)
