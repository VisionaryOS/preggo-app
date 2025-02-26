module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Disable the rule for unescaped entities
    'react/no-unescaped-entities': 'off',
    
    // Enforce no unused variables
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
  }
}; 