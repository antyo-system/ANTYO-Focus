const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules'],
  },
  {
    files: ['**/*.js'],
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }]
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly'
      }
    }
  }
];
