# shadcn/ui Styling Guide

This project uses [shadcn/ui](https://ui.shadcn.com/) for a consistent, high-performance component library built on Radix UI and styled with Tailwind CSS.

## Core Principles

1. **Use Existing Components** - Always use components from `@/components/ui/*` rather than creating new components or styling patterns.
2. **Maintain Consistent Tokens** - Use color and spacing tokens from the theming system rather than hardcoded values.
3. **Progressive Enhancement** - Components should work without JavaScript and degrade gracefully.
4. **Accessibility First** - All components meet WCAG 2.1 AA standards.

## Getting Started

### Importing Components

```tsx
// ✅ Do this
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

// ❌ Not this
import { Button } from "@radix-ui/react-button";
import { Input } from "somewhere-else";
```

### Styling Components

Use Tailwind classes with our token system:

```tsx
// ✅ Do this
<Button className="bg-primary text-primary-foreground">Click Me</Button>

// ❌ Not this
<Button style={{ backgroundColor: '#1E40AF' }}>Click Me</Button>
```

## Theme Switching

The app supports light and dark modes via the ThemeProvider. Use the ThemeToggle component to allow users to switch themes:

```tsx
import { ThemeToggle } from "@/components/ui";

// In your component:
<ThemeToggle />
```

## Form Patterns

Always use the Form components from shadcn/ui for consistent form handling:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema
const formSchema = z.object({
  name: z.string().min(2),
});

// Use the form
function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Available Components

- **Primitive Elements**: Button, Input, Checkbox, Select, etc.
- **Layout Components**: Card, Dialog, Sheet, etc.
- **Feedback**: Toast, Alert, etc.
- **Navigation**: Tabs, DropdownMenu, etc.

## Customizing Components

If you need to customize a component beyond what's available through props and Tailwind classes, follow these steps:

1. Check if the customization can be achieved through the `variants` prop or Tailwind classes
2. If not, create a specialized version of the component that uses the original component
3. Document any custom component in your PR

## Enforcing Standards

We use ESLint rules to enforce consistent usage of the styling system. Run `npm run lint` to check for issues.

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Design System Configuration](src/lib/config/design-system.ts) 