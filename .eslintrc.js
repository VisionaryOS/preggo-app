module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Fix restricted imports rule
    "no-restricted-imports": ["warn", {
      "patterns": [{
        "group": ["@radix-ui/*"],
        "message": "Please import from '@/components/ui/*' instead of directly from Radix UI."
      }],
      "paths": [{
        "name": "react-hook-form",
        "importNames": ["useForm"],
        "message": "Please use the Form component from '@/components/ui/form' for consistent forms."
      }, {
        "name": "class-variance-authority",
        "message": "Please use existing UI components instead of creating new variants."
      }]
    }],
    // Enforce usage of Tailwind CSS classes over inline styles
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-key": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
    // Disable some strict TypeScript rules during development
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    // Performance and quality rules
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-expressions": "warn",
    // Environment-specific rules that can be disabled in development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn"
  },
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "public/**",
    "src/components/ui/**" // Don't lint shadcn/ui components
  ],
  // Overrides for specific file patterns
  overrides: [
    {
      // Less strict for test files
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-unused-expressions": "off",
      }
    },
    {
      // Less strict for middleware
      files: ["middleware.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      }
    }
  ],
  settings: {
    next: {
      rootDir: "./",
    },
    react: {
      version: "detect",
    },
  },
}; 