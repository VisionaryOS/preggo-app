# shadcn/ui Migration Plan

This document outlines the plan for transitioning all components to shadcn/ui components, as per the new design system guidelines.

## New Color Theme

We've updated our color theme to use a warm orange/amber primary color palette:

- **Primary**: A warm orange (24.6 95% 53.1%)
- **Secondary**: A light neutral gray (60 4.8% 95.9%)
- **Chart Colors**: A progressive palette for data visualization

These colors are now applied globally through our CSS variables in `globals.css`.

## Migration Checklist

### High Priority Components (Convert First)

- [ ] Form Elements (Input, Select, Checkbox, etc.)
- [ ] Buttons and CTAs
- [ ] Navigation Elements (Tabs, Menus)
- [ ] Cards and Containers
- [ ] Modals and Dialogs

### Medium Priority Components

- [ ] Tables and Data Displays
- [ ] Feedback Components (Alerts, Notifications)
- [ ] Progress Indicators
- [ ] Dropdowns and Comboboxes

### Low Priority Components

- [ ] Tooltips
- [ ] Badges
- [ ] Avatars
- [ ] Separators

## Conversion Process

For each component:

1. Identify the current implementation
2. Find the shadcn/ui equivalent component
3. Replace the implementation with the shadcn/ui version
4. Adjust the styling using Tailwind classes
5. Test for functionality and appearance
6. Update any dependent components

## Guidelines

- **Always use the shadcn/ui component** instead of custom implementations
- **Use Tailwind classes** for styling, not inline styles or custom CSS
- **Maintain consistent spacing** using the design system tokens
- **Test in both light and dark modes** to ensure proper contrast

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Project Design System Guide](./SHADCN-UI-GUIDE.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Tracking Progress

Use this document to track migration progress by checking off components as they are converted. Add notes about any challenges or special considerations for specific components. 