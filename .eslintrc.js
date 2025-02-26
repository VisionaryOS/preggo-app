module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['.next/**/*', 'node_modules/**/*'],
  rules: {
    // Disable the rule for unescaped entities
    'react/no-unescaped-entities': 'off',
    
    // Enforce no unused variables
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    
    // Relax some TypeScript rules for development
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}; 