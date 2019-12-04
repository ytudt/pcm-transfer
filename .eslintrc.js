module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: 'airbnb',
  env: {
      browser: true,
      node: true,
      commonjs: true,
      es6: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'prefer-destructuring': 'off',
    'class-methods-use-this': 'off',
    'no-case-declarations': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
  }
};
