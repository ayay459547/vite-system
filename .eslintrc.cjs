/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      tsx: true // Allows for the parsing of JSX
      // jsx: true
    }
  },
  rules: {
    // 要求使用 === 和 !==
    eqeqeq: ['warn', 'always'],
    // 不要分號
    semi: ['warn', 'never'],
    // 使用單引號
    quotes: ['warn', 'single'],
    // 逗號 前面不空格 後面要空格
    'comma-spacing': ['warn', { 'before': false, 'after': true }],
    // object 冒號 前面不空格 後面號空格
    'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
    // 操作符前後需要加空格: + - * /
    'space-infix-ops': 'warn',
    // ojbect, array 最後一格不要加上逗號
    'comma-dangle': ['warn', 'never'],
    // 行末禁止加空格
    'no-trailing-spaces': 'warn',
    // 前頭函數 前後空格
    'arrow-spacing': ['warn', { 'before': true, 'after': true }],
    // 函數前面加空格
    'space-before-function-paren': ['warn', 'always']
  }
}
