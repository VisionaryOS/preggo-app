# Book Chapter Implementation Guide

This document provides detailed instructions on how to add new book chapters to the pregnancy app.

## Overview

The pregnancy app includes a resources section with book chapters about pregnancy. Each chapter is structured with:

- Title and summary
- Multiple content sections
- Optional images and related resources
- Metadata like trimester, tags, and related pregnancy weeks

## File Structure

The book chapters feature is organized as follows:

- `src/data/book-chapter-template.ts`: Template file with TypeScript interfaces and example structure
- `src/data/book-chapters.ts`: Central registry for all chapters with helper functions
- `src/data/chapter-*.ts`: Individual chapter files (e.g., chapter-1.ts, chapter-2.ts)
- `src/components/resources/ChapterViewer.tsx`: Component for displaying a chapter
- `src/components/resources/ChaptersList.tsx`: Component for listing all chapters
- `src/app/resources/chapters/[slug]/page.tsx`: Dynamic page for viewing a specific chapter
- `src/app/resources/chapters/page.tsx`: Index page showing all available chapters

## Adding a New Chapter

Follow these steps to add a new chapter:

1. **Create a new chapter file**:
   - Make a copy of `book-chapter-template.ts`
   - Rename it to `chapter-X.ts` (where X is the chapter number)
   - Place it in the `src/data` directory

2. **Fill in the chapter content**:
   - Update the chapter ID, title, and slug
   - Write a concise summary
   - Create sections with titles, keys, and content
   - Add relevant images (if applicable)
   - Add related resources (if applicable)
   - Add appropriate tags, trimester, and week information

3. **Register your chapter**:
   - Open `src/data/book-chapters.ts`
   - Import your new chapter file
   - Add it to the `chapters` array

## Markdown Formatting for Optimal Learning

To create an engaging and effective learning experience, follow these enhanced Markdown formatting guidelines:

### Heading Structure & Hierarchy
- Use `# Heading` for main section titles (H1)
- Use `## Subheading` for subsections (H2)
- Use `### Minor heading` for detailed topics (H3)
- Maintain a consistent hierarchy to help readers mentally organize content

### Text Emphasis
- Use `**bold text**` for important concepts, definitions, or key takeaways
- Use `*italic text*` for emphasis or introducing new terminology
- Avoid overusing emphasis which can reduce its effectiveness

### Lists & Organization
- Use bulleted lists (`- item`) for unordered collections of related points
- Use numbered lists (`1. step`) for sequential instructions or prioritized information
- Consider nested lists for hierarchical information
- Use task lists (`- [ ] item`) for actionable checklists

### Visual Separators & Information Blocks
- Use horizontal rules (`---`) to separate major content sections
- Use blockquotes (`> note`) for important callouts, warnings, or tips
- Add emoji icons to callouts for visual cues (`> **💡 Tip:**`, `> **⚠️ Warning:**`)

### Special Info Boxes
You can create styled info boxes using the following syntax:

```
[!INFO] 
This is a general information box.

[!WARNING] 
This is a warning box for cautionary information.

[!TIP] 
This is a tip box with helpful suggestions.

[!SUCCESS] 
This is a success box for positive outcomes or achievements.

[!QUESTION] 
This is a question box for rhetorical questions or discussion points.

[!DEFINITION] Term:
This is a definition box that explains a specific term.
```

You can customize the title of any info box by adding a title followed by a colon:

```
[!INFO] Custom Title:
This info box has a custom title.
```

### Knowledge Checks
You can create interactive knowledge check quizzes using the following syntax:

```
[!QUIZ]
Question: What is the benefit of using markdown for content formatting?
Options:
A. Easier to style than plain text (correct)
B. Allows complex JavaScript functionality
C. Only works in dark mode
D. Requires a paid license
Explanation: Markdown provides simple text-based syntax that can be easily styled, making it much more flexible than plain text while being simpler than full HTML.
```

Options marked with `(correct)` will be highlighted as the correct answers when users interact with the quiz. The explanation is optional.

### Tables & Structured Information
- Use tables for comparing information or presenting structured data:
```
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Code Blocks
- Use code blocks (``` ```) for examples, formulas, or multi-step processes
- Use inline code (`` `example` ``) for short references to specific terms or values

### Visual Flow
- Use consistent paragraph spacing for readability
- Break up long sections of text with headings, lists, or callouts
- End each section with a summary, transition, or call to action

### Learning Elements
- Add "knowledge check" questions at the end of sections
- Use callout boxes for "Did You Know?" facts or "Important" information
- Include clear transitions between related topics
- Consider adding a "Key Takeaways" section at the end of complex topics

## Example Chapter Structure

Here's a simplified example of a chapter file with enhanced formatting:

```typescript
import { Chapter } from './book-chapter-template';

const chapter: Chapter = {
  id: 2,
  title: "Nutrition During Pregnancy",
  slug: "nutrition-during-pregnancy",
  summary: "A guide to healthy eating and nutrition throughout your pregnancy.",
  sections: [
    {
      title: "Introduction",
      key: "introduction",
      content: `
# Eating for Two

Nutrition during pregnancy is **vital for both your health and your baby's development**. This chapter will help you understand:

- The importance of key nutrients
- How to plan balanced meals
- Common nutrition myths

> **💡 Remember:** You're not literally eating for two adults - your calorie needs increase by only about 300-500 calories per day during pregnancy.

[!TIP] Healthy Habits:
Start your day with a nutrient-rich breakfast containing protein and fiber to help manage morning sickness and provide sustained energy.
      `
    },
    // More sections...
  ],
  tags: ["nutrition", "health", "diet"],
  trimester: 1,
  week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
};

export default chapter;
```

## Best Practices

1. **Keep content well-structured**:
   - Break long sections into smaller, focused sections
   - Use clear, descriptive titles for sections
   - Keep paragraphs concise and readable

2. **Maintain consistent formatting**:
   - Follow the Markdown formatting guidelines
   - Use consistent heading levels
   - Structure similar content in similar ways

3. **Optimize for readability**:
   - Use plain language accessible to non-medical readers
   - Define medical terms when first introduced
   - Use bullet points for lists of symptoms, tips, etc.

4. **Apply learning design principles**:
   - Begin with an overview of what will be covered
   - Present information in logical, sequential order
   - Use examples to illustrate abstract concepts
   - Include visual elements when helpful
   - Reinforce important points through repetition in different formats

5. **Include relevant metadata**:
   - Tag chapters appropriately for searchability
   - Associate chapters with relevant trimesters and weeks
   - Link to related resources when appropriate

## Technical Requirements

To fully implement the chapter viewer component, you need:

```bash
npm install react-markdown
```

## Additional Notes

- Chapter slugs must be unique and URL-friendly (use kebab-case)
- Section keys must be unique within a chapter
- Image paths should be relative to the public directory
- External links in related resources will automatically open in a new tab

## Troubleshooting

If your chapter doesn't appear:
1. Check that it's properly imported in `book-chapters.ts`
2. Verify that the chapter object follows the `Chapter` interface
3. Ensure the slug is unique among all chapters

For formatting issues:
1. Check that your Markdown syntax is correct
2. Ensure proper whitespace in the content template literals
3. Validate that all required fields have values 