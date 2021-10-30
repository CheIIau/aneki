module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  plugins: ['vue', 'prettier'],
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // 'prettier/prettier': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    // 'max-len': ['error', { code: 240 }],
  },
};
