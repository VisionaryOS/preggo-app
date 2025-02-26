module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Enforce use of shadcn/ui pattern
    "no-restricted-imports": [
      "warn",
      {
        "patterns": [
          {
            "group": ["@radix-ui/*"],
            "message": "Please import from '@/components/ui/*' instead of directly from Radix UI.",
            "allowTypeImports": true
          }
        ],
        "paths": [
          {
            "name": "react-hook-form",
            "importNames": ["useForm"],
            "message": "Please use the Form component from '@/components/ui/form' for consistent forms."
          },
          {
            "name": "class-variance-authority",
            "message": "Please use existing UI components instead of creating new variants."
          }
        ]
      }
    ],
    // Enforce usage of Tailwind CSS classes over inline styles
    "react/jsx-no-inline-styles": "warn",
    // Enforce no direct usage of classnames or clsx in components
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "CallExpression[callee.name='classnames'], CallExpression[callee.name='clsx']",
        "message": "Please use 'cn' from '@/lib/utils' instead of directly using classnames or clsx."
      }
    ],
    // Add rule for empty classes
    "@typescript-eslint/ban-ts-comment": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "public/**",
    "src/components/ui/**" // Don't lint shadcn/ui components
  ],
}; 