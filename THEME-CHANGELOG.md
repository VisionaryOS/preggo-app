# Theme System Changelog

## Major Update: shadcn/ui Standardization (Date: Current)

We've implemented a complete overhaul of our styling system to standardize on shadcn/ui components and a new color theme.

### 🎨 Color Theme Changes

The application now uses a warm orange/amber primary color palette instead of the previous blue theme:

#### Light Mode
- **Primary**: Warm orange (24.6 95% 53.1%)
- **Secondary**: Light neutral gray (60 4.8% 95.9%)
- **Chart Colors**: A progressive palette optimized for data visualization
- **Border Radius**: Updated to 1rem (previously 0.8rem)

#### Dark Mode
- **Primary**: Warm amber (20.5 90.2% 48.2%)
- **Secondary**: Dark neutral (12 6.5% 15.1%)
- **Chart Colors**: A complementary dark mode palette

### 🧩 Component System Changes

- All components should now use shadcn/ui primitives
- Deprecated the custom component styles in favor of shadcn/ui + Tailwind
- Added strict ESLint rules to enforce shadcn/ui usage

### 📚 Documentation

- Added SHADCN-UI-GUIDE.md with usage guidelines
- Added SHADCN-UI-MIGRATION.md with migration checklist
- Created example components in src/components/examples

### 🛠 Tooling

- Added scripts/shadcn-component-check.js to help identify components that need migration
- Updated ESLint rules to enforce component usage patterns

### 📋 Migration Instructions

1. Review the SHADCN-UI-MIGRATION.md file for the migration checklist
2. Use the shadcn-component-check.js script to identify components that need migration
3. Follow the example in src/components/examples/ShadcnExampleCard.tsx
4. Run ESLint to check for compliance with new standards

### 👀 Visual Before/After

The new theme emphasizes:
- Warmer, more inviting colors
- Better dark mode contrast
- More consistent component styling
- Improved accessibility with better foreground/background contrast

### 🚀 Next Steps

- Complete migration of all components to shadcn/ui
- Add theme switching control to main navigation
- Update documentation images to reflect new theme
- Create component library showcase page 