# Search System Documentation

## Overview

The search system in this application has been completely overhauled to use FlexSearch, a powerful full-text search library optimized for browser environments. The new implementation provides fast, accurate, and flexible search capabilities across the entire application.

## Architecture

The search system follows a modular architecture with the following components:

1. **Core Search Engine** (`src/lib/search.ts`)
   - Implements FlexSearch Document with optimized settings
   - Handles indexing and search operations
   - Manages the search index as a singleton for better performance

2. **Custom Hook** (`src/hooks/useSearch.ts`)
   - Encapsulates all search-related logic in one place
   - Provides a clean API for components to use search functionality
   - Handles state management, search execution, and navigation

3. **Preloading System** (`src/hooks/useSearchPreload.ts`)
   - Initializes the search index during application startup
   - Ensures search data is available immediately when needed

4. **Search UI Components** (`src/components/search/EnhancedSearch.tsx`)
   - Provides a user-friendly search interface
   - Handles user interactions, keyboard shortcuts, and accessibility
   - Displays search results with rich formatting

## Features

- **Fast Full-Text Search**: Utilizes FlexSearch's optimized algorithms for near-instant results
- **Multi-Field Search**: Searches across multiple fields (title, description, content, tags)
- **Categorized Results**: Groups results by type (tools, lessons, wiki, page content)
- **Filtering**: Allows users to filter results by category
- **Keyboard Navigation**: Supports keyboard shortcuts and arrow key navigation
- **Search Suggestions**: Shows trending and recent searches for quick access
- **Performance Monitoring**: Tracks and logs search performance metrics

## Technical Details

### Search Index Configuration

The FlexSearch index is configured with the following settings:

```typescript
new Document<SearchDocument>({
  document: {
    id: 'id',
    index: [
      {
        field: 'title',
        tokenize: 'forward',
        resolution: 9,
        optimize: true,
        cache: 100
      },
      {
        field: 'description',
        tokenize: 'full',
        resolution: 5,
        optimize: true,
        context: {
          depth: 1,
          resolution: 3
        }
      },
      {
        field: 'content',
        tokenize: 'full',
        resolution: 5,
        optimize: true,
        context: {
          depth: 2,
          resolution: 2
        }
      },
      {
        field: 'tags',
        tokenize: 'strict',
        resolution: 9,
        optimize: true
      },
      {
        field: 'type',
        tokenize: 'strict',
        resolution: 9
      }
    ],
    store: ['title', 'type', 'path', 'description', 'tags'] as any
  },
  tokenize: 'forward',
  optimize: true,
  cache: 100
});
```

### Data Flow

1. The search index is initialized at application startup
2. When a user enters a query, the search hook processes it:
   - Normalizes the query
   - Performs search using FlexSearch
   - Processes and deduplicates results
   - Updates the UI with the results
3. Results are filtered based on user preferences
4. When a result is selected, the app navigates to the corresponding path

## Usage Example

```tsx
// In a component
import { useSearch } from '@/hooks/useSearch';

function SearchComponent() {
  const {
    searchQuery,
    searchResults,
    handleSearchChange,
    handleResultClick
  } = useSearch();

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search..."
      />
      
      <div>
        {searchResults.map((result) => (
          <div key={result.id} onClick={() => handleResultClick(result.path)}>
            {result.title}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Performance Considerations

- The search index is stored as a singleton to avoid rebuilding it on each search
- Debouncing is implemented to prevent excessive searches during typing
- Search operations are optimized with appropriate caching and tokenization
- The index is preloaded during application startup to minimize initial search delay

## Future Improvements

- Implement server-side indexing for larger datasets
- Add fuzzy search capabilities for more forgiving matching
- Implement relevance scoring to prioritize more relevant results
- Add support for synonyms and alternative terms 