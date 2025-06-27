// @ts-check

import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettierConfig from 'eslint-config-prettier'

export default [
  createConfigForNuxt(),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/arrow-parens': 'off',
      'vue/no-multiple-template-root': 'off',
      'nuxt/nuxt-config-keys-order': 'off',
    },
  },
  prettierConfig,
]
