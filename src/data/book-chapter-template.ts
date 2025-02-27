/**
 * BOOK CHAPTER TEMPLATE
 * 
 * Instructions for AI agent:
 * 1. Create a copy of this file for each chapter, naming it chapter-{number}.ts (e.g., chapter-1.ts)
 * 2. Fill in the chapter content following the structure below
 * 3. Make sure to maintain the TypeScript interfaces and structure
 * 4. Add proper formatting using Markdown syntax for content sections
 * 5. Update the exports in book-chapters.ts to include your new chapter
 */

// Chapter content interface definition
export interface Section {
  title: string;
  content: string; // Supports Markdown formatting
  key: string; // URL-friendly identifier for navigation
}

export interface ChapterImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface RelatedResource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'tool' | 'external';
}

export interface Chapter {
  id: number;
  title: string;
  slug: string; // URL-friendly chapter identifier
  summary: string;
  sections: Section[];
  images?: ChapterImage[];
  relatedResources?: RelatedResource[];
  tags: string[]; // For search and categorization
  trimester?: 1 | 2 | 3 | 'postpartum'; // If applicable
  week?: number | number[]; // If tied to specific pregnancy week(s)
}

/**
 * CHAPTER TEMPLATE - Replace with actual content
 * 
 * Notes:
 * - Content supports Markdown for formatting (headings, lists, bold, etc.)
 * - Keep section keys unique and URL-friendly (use kebab-case)
 * - Add as many sections as needed for your chapter
 * - Images and related resources are optional
 */
const chapter: Chapter = {
  id: 1, // Chapter number
  title: "Chapter Title Goes Here",
  slug: "chapter-title-slug", // URL-friendly version of title
  summary: "A brief 1-2 sentence summary of what this chapter covers.",
  sections: [
    {
      title: "Introduction",
      key: "introduction",
      content: `
# Chapter Introduction

This section introduces the main topic of the chapter. Begin with a clear overview of **what the reader will learn** and why it's important. Provide context and set expectations.

## In This Chapter

You'll learn about:

- Key concept one
- Important principle two
- Practical application three

> **💡 Tip:** Start each chapter with a clear roadmap of what will be covered to help readers mentally prepare for the content.
      `
    },
    {
      title: "Core Concepts",
      key: "core-concepts",
      content: `
# Understanding the Fundamentals

This section should cover the essential concepts that form the foundation of your topic. Break complex information into digestible chunks.

## Key Concept One

Explain the first important concept clearly and concisely. Use plain language and provide examples where helpful.

### In Practice

Here's how this concept applies in real situations:

1. First application or example
2. Second application or example
3. Third application or example

---

## Key Concept Two

| Aspect | Description | Why It Matters |
|--------|-------------|----------------|
| Feature 1 | What it is | How it helps |
| Feature 2 | What it is | How it helps |
| Feature 3 | What it is | How it helps |

> **⚠️ Important:** Highlight crucial information in callout boxes to ensure it catches the reader's attention.

### Quick Knowledge Check

Ask yourself:
- How does concept one relate to concept two?
- When would you apply this knowledge?
- What are the potential challenges?
      `
    },
    {
      title: "Practical Applications",
      key: "practical-applications",
      content: `
# Putting Knowledge Into Practice

Now that you understand the core concepts, let's explore how to apply them in everyday situations.

## Step-by-Step Guide

\`\`\`
1. Begin by assessing your situation
2. Apply the first principle we discussed
3. Monitor and adjust as needed
4. Reflect on the outcomes
\`\`\`

## Common Scenarios

### Scenario One: [Brief Description]

In this situation, you might experience [symptoms/challenges]. Here's how to address them:

- **First approach**: Description and benefits
- **Alternative method**: When to use this instead
- **When to seek help**: Clear indicators

---

### Scenario Two: [Brief Description]

Similar structure with relevant content...

## Visual Aid

Refer to the illustrations section for a visual representation of these concepts.

> **💫 Remember:** Practice makes perfect. Don't be discouraged if you need to review these steps multiple times.
      `
    },
    {
      title: "Summary and Next Steps",
      key: "summary",
      content: `
# Key Takeaways

Let's review what we've covered in this chapter:

- **Core concept one**: Brief recap of the main points
- **Core concept two**: Brief recap of the main points
- **Practical applications**: Summary of how to apply this knowledge

## What's Next?

In the following chapter, we'll build on these foundations to explore [next topic]. You'll learn how [brief preview of next chapter].

## Action Items

Before moving on, consider:

- [ ] Reviewing any sections that weren't completely clear
- [ ] Making notes on how these concepts apply to your situation
- [ ] Checking out the related resources for additional information

> **🌟 Remember:** Learning is a journey. Take your time to absorb this information at your own pace.
      `
    },
    // Add more sections as needed
  ],
  images: [
    // Optional: Include relevant images
    {
      url: "/images/resources/chapter-1/example-image.jpg", // Path should be relative to public directory
      alt: "Description of the image for accessibility",
      caption: "Optional caption explaining the image" // Optional
    }
  ],
  relatedResources: [
    // Optional: Include related resources
    {
      title: "Related Article Title",
      url: "/resources/related-article",
      type: "article"
    },
    {
      title: "Helpful External Resource",
      url: "https://example.com/external-resource",
      type: "external"
    }
  ],
  tags: ["pregnancy", "first trimester", "example", "health"], // Add relevant tags for searchability
  trimester: 1, // Optional: specify which trimester this content is most relevant for
  week: [1, 2, 3, 4] // Optional: specify which week(s) this content is most relevant for
};

export default chapter; 