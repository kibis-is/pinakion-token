module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-unresolved': 'off',
    'prefer-const': 'off',
  },
  overrides: [
    {
      files: ['*.avm.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'object-shorthand': 'off',
        'class-methods-use-this': 'off',
        'no-undef': 'off',
        'max-classes-per-file': 'off',
        'no-bitwise': 'off',
        'operator-assignment': 'off',
        'prefer-template': 'off',
        'prefer-destructuring': 'off',
      },
    },
  ],
};
