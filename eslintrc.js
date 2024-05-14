export default {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', '.prettierrc'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', '.prettierrc'],
  rules: {
    'no-console': 1,
    'prettier/prettier': 2,
    'no-unused-vars': 1,
    'no-implicit-globals': 2, 
    'prefer-const': 1,
    'no-var': 2, 
    'eqeqeq': 2,
  }
}
