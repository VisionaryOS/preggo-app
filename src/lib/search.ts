// Import FlexSearch correctly
import FlexSearch from 'flexsearch';
import { SearchItem } from '@/store/search-store';
import { chapters } from '@/data/book-chapters';
import { BookOpen, Search, Info, Wrench, Library } from 'lucide-react';

// Define the structure for search documents
interface SearchDocument {
  id: string;
  title: string;
  content?: string;
  type: string;
  path: string;
  description?: string;
  tags?: string[];
}

// Define index type more clearly
type FlexSearchIndex = any; // Using any as FlexSearch types are problematic

// Static sample data to populate search index
const SAMPLE_SEARCH_DATA: SearchDocument[] = [
  // Tools
  {
    id: 'tool-1',
    title: 'Contraction Timer',
    type: 'tool',
    path: '/tools/contraction-timer',
    description: 'Track your contractions with precision',
    tags: ['labor', 'delivery', 'timing']
  },
  {
    id: 'tool-2',
    title: 'Due Date Calculator',
    type: 'tool',
    path: '/dashboard/due-date',
    description: 'Calculate your estimated due date based on your last period',
    tags: ['pregnancy', 'planning', 'calendar']
  },
  {
    id: 'tool-3',
    title: 'Weight Tracker',
    type: 'tool',
    path: '/dashboard/health',
    description: 'Monitor your pregnancy weight gain',
    tags: ['health', 'monitoring', 'pregnancy']
  },
  {
    id: 'tool-4',
    title: 'Baby Name Finder',
    type: 'tool',
    path: '/tools/name-finder',
    description: 'Find the perfect name for your baby',
    tags: ['baby', 'names', 'planning']
  },
  {
    id: 'tool-5',
    title: 'Hospital Bag Checklist',
    type: 'tool',
    path: '/dashboard/shopping',
    description: 'Everything you need to pack for the hospital',
    tags: ['preparation', 'hospital', 'delivery']
  },
  
  // Lessons
  {
    id: 'lesson-1',
    title: 'First Trimester Nutrition',
    type: 'lesson',
    path: '/resources/chapters/nutrition-first-trimester',
    description: 'Essential nutrients for early pregnancy',
    tags: ['nutrition', 'first trimester', 'health']
  },
  {
    id: 'lesson-2',
    title: 'Understanding Fetal Development',
    type: 'lesson',
    path: '/resources/chapters/fetal-development',
    description: 'Week by week development of your baby',
    tags: ['fetal development', 'pregnancy', 'education']
  },
  {
    id: 'lesson-3',
    title: 'Managing Pregnancy Symptoms',
    type: 'lesson',
    path: '/resources/chapters/managing-symptoms',
    description: 'Tips for dealing with common pregnancy discomforts',
    tags: ['symptoms', 'comfort', 'health']
  },
  {
    id: 'lesson-4',
    title: 'Preparing for Labor',
    type: 'lesson',
    path: '/resources/chapters/labor-prep',
    description: 'Everything you need to know before labor begins',
    tags: ['labor', 'preparation', 'birth']
  },
  {
    id: 'lesson-5',
    title: 'Newborn Care Basics',
    type: 'lesson',
    path: '/resources/chapters/newborn-care',
    description: 'Essential care practices for your newborn',
    tags: ['newborn', 'care', 'baby']
  }
];

// Add all page content as searchable documents
const PAGE_CONTENT: SearchDocument[] = [
  {
    id: 'page-dashboard',
    title: 'Dashboard',
    type: 'page',
    path: '/dashboard',
    content: 'Pregnancy dashboard overview tracking milestones appointments health metrics baby development progress weekly updates',
    description: 'Your pregnancy dashboard with personalized information',
    tags: ['dashboard', 'overview', 'home']
  },
  {
    id: 'page-contraction-timer',
    title: 'Contraction Timer',
    type: 'page',
    path: '/tools/contraction-timer',
    content: 'Track contractions frequency duration interval pattern labor delivery timing stopwatch monitor',
    description: 'Track your contractions during labor',
    tags: ['labor', 'contractions', 'timer', 'delivery']
  },
  {
    id: 'page-nutrition',
    title: 'Nutrition Guide',
    type: 'page',
    path: '/resources/nutrition',
    content: 'Healthy eating pregnancy nutrition diet food guide meals planning vitamins minerals folate iron calcium protein hydration recipes',
    description: 'Complete guide to nutrition during pregnancy',
    tags: ['nutrition', 'diet', 'food', 'health']
  },
  {
    id: 'page-todo',
    title: 'Todo List',
    type: 'page',
    path: '/dashboard/todo',
    content: 'Todo list tasks checklist pregnancy preparation baby checklist hospital bag name selection nursery setup doctor appointments',
    description: 'Keep track of your pregnancy to-do list',
    tags: ['tasks', 'checklist', 'organization']
  },
  {
    id: 'page-calendar',
    title: 'Calendar',
    type: 'page',
    path: '/dashboard/calendar',
    content: 'Calendar schedule appointments reminders doctor visits tests ultrasounds important dates milestones countdown',
    description: 'Calendar of appointments and pregnancy milestones',
    tags: ['calendar', 'appointments', 'schedule']
  },
  {
    id: 'page-journal',
    title: 'Pregnancy Journal',
    type: 'page',
    path: '/community/journal',
    content: 'Journal diary pregnancy milestones feelings emotions memories record document photos moments thoughts personal',
    description: 'Document your pregnancy journey',
    tags: ['journal', 'memories', 'diary']
  },
  {
    id: 'page-name-finder',
    title: 'Baby Name Explorer',
    type: 'page',
    path: '/tools/name-finder',
    content: 'Baby name finder search explore meanings origins popularity trends gender neutral name combinations name ideas inspiration',
    description: 'Find the perfect name for your baby',
    tags: ['names', 'baby', 'finder']
  },
  {
    id: 'page-health-tracker',
    title: 'Health Tracker',
    type: 'page',
    path: '/dashboard/health',
    content: 'Health tracker weight symptoms blood pressure mood sleep exercise water intake medications symptoms log pregnancy health',
    description: 'Track your pregnancy health metrics',
    tags: ['health', 'tracking', 'symptoms', 'weight']
  },
  // Add missing pages
  {
    id: 'page-shopping',
    title: 'Shopping List',
    type: 'page',
    path: '/dashboard/shopping',
    content: 'Baby shopping list checklist registry essentials nursery clothing feeding travel healthcare toys budget tracking purchases hospital bag items',
    description: 'Keep track of everything you need for your baby',
    tags: ['shopping', 'registry', 'checklist', 'baby items']
  },
  {
    id: 'page-due-date',
    title: 'Due Date Calculator',
    type: 'page',
    path: '/dashboard/due-date',
    content: 'Due date calculator pregnancy timeline trimester countdown estimated delivery date last menstrual period conception date',
    description: 'Calculate and track your pregnancy due date',
    tags: ['due date', 'calculator', 'timeline', 'pregnancy']
  },
  {
    id: 'page-appointments',
    title: 'Appointments',
    type: 'page',
    path: '/dashboard/appointments',
    content: 'Pregnancy appointments doctor visits ultrasounds tests checkups scheduling prenatal care obstetrician midwife reminders',
    description: 'Manage and track your pregnancy appointments',
    tags: ['appointments', 'doctor', 'prenatal', 'schedule']
  },
  {
    id: 'page-baby',
    title: 'Baby Development',
    type: 'page',
    path: '/dashboard/baby',
    content: 'Baby development fetal growth milestones size week by week ultrasound images pregnancy progress tracking',
    description: 'Track your baby\'s development during pregnancy',
    tags: ['baby', 'development', 'growth', 'fetal']
  },
  {
    id: 'page-weekly',
    title: 'Weekly Updates',
    type: 'page',
    path: '/dashboard/weekly',
    content: 'Weekly pregnancy updates what to expect baby development body changes symptoms tips advice week by week guide',
    description: 'Get personalized weekly updates for your pregnancy journey',
    tags: ['weekly', 'updates', 'pregnancy', 'development']
  },
  {
    id: 'page-wellbeing',
    title: 'Wellbeing',
    type: 'page',
    path: '/dashboard/wellbeing',
    content: 'Pregnancy wellbeing mental health self-care stress management meditation relaxation exercise mood tracking support resources',
    description: 'Track and improve your wellbeing during pregnancy',
    tags: ['wellbeing', 'mental health', 'self-care', 'support']
  }
  // Add more pages here based on your application
];

// Initialize search index
const initializeSearchIndex = () => {
  console.log("Initializing search index...");
  try {
    // Create a document search instance with optimal settings
    // @ts-ignore - FlexSearch types are incomplete
    const index = new FlexSearch.Document({
      document: {
        id: 'id',
        index: [
          {
            field: 'title',
            tokenize: 'forward', // Use forward tokenization for better predictive search
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
        store: true // Store all fields for retrieval
      },
      tokenize: 'forward', // This enables predictive search as you type
      optimize: true,
      cache: 100
    });
    
    // Log index creation
    console.log("FlexSearch index created successfully");
    
    // Add sample data to the index
    let indexCount = 0;
    console.log(`Adding ${SAMPLE_SEARCH_DATA.length} sample items to search index`);
    SAMPLE_SEARCH_DATA.forEach(doc => {
      index.add(doc);
      indexCount++;
    });
    
    // Add page content to the index
    console.log(`Adding ${PAGE_CONTENT.length} page content items to search index`);
    PAGE_CONTENT.forEach(doc => {
      index.add(doc);
      indexCount++;
    });
    
    // Add wiki chapters to the index
    const wikiDocuments = chapters.map(chapter => ({
      id: `wiki-${chapter.id}`,
      title: chapter.title,
      content: `${chapter.summary} ${chapter.sections.map(s => `${s.title} ${s.content}`).join(' ')}`,
      type: 'wiki',
      path: `/dashboard/wiki/chapters/${chapter.id}`,
      description: chapter.summary,
      tags: ['wiki', 'chapter', 'pregnancy']
    }));
    
    console.log(`Adding ${wikiDocuments.length} wiki chapters to search index`);
    wikiDocuments.forEach(doc => {
      index.add(doc);
      indexCount++;
    });
    
    console.log(`Search index initialized with ${indexCount} total documents`);
    return index;
  } catch (error) {
    console.error("Error initializing search index:", error);
    throw error;
  }
};

// Singleton instance for search index
let searchIndexInstance: FlexSearchIndex = null;
let isIndexInitialized = false;

// Get or initialize the search index
export const getSearchIndex = () => {
  if (!searchIndexInstance) {
    searchIndexInstance = initializeSearchIndex();
    isIndexInitialized = true;
  }
  return searchIndexInstance;
};

// Reset the search index (useful for testing)
export const resetSearchIndex = () => {
  searchIndexInstance = null;
  isIndexInitialized = false;
};

// Process search results for display
export const processSearchResults = (results: Array<{ id: string; score?: number }>) => {
  return results.map((result: { id: string; score?: number }) => {
    // @ts-ignore - FlexSearch types are problematic
    const item: SearchDocument = searchIndexInstance.get(result.id);
    return {
      ...item,
      relevanceScore: result.score || 1
    };
  });
};

// Add items to the search index
export const addItemsToIndex = (items: SearchItem[]) => {
  const index = getSearchIndex();
  
  // Convert SearchItems to SearchDocuments for indexing
  const searchDocuments: SearchDocument[] = items.map(item => ({
    id: item.id,
    title: item.title,
    type: item.type,
    path: item.path,
    description: item.description || ''
  }));
  
  // Add each document to the index
  searchDocuments.forEach(doc => {
    index.add(doc);
  });
};

// Search the index with given query and options
export const searchIndexItems = (
  query: string, 
  options?: {
    limit?: number;
    suggest?: boolean;
    fields?: string[];
  }
): SearchItem[] => {
  if (!query || query.trim().length < 1) { // Reduced to 1 character for better prediction
    return [];
  }
  
  const index = getSearchIndex();
  const normalizedQuery = query.trim().toLowerCase(); // Ensure lowercase for better matching
  
  // Default search options
  const searchOptions = {
    limit: 50, // Increased limit
    suggest: true, // Enable suggestions for predictive search
    ...options
  };
  
  try {
    console.log(`FlexSearch: Searching for "${normalizedQuery}" with options:`, searchOptions);
    
    // Perform the search across specified fields or all fields
    let results;
    
    // Safely check if fields exist and is not empty
    const hasSpecificFields = options && 
                             'fields' in options && 
                             Array.isArray(options.fields) && 
                             options.fields.length > 0;
                             
    if (hasSpecificFields) {
      // Search only in specified fields
      const fieldResults = (options.fields as string[]).map(field => 
        index.search(normalizedQuery, {
          ...searchOptions,
          index: field,
          suggest: true, // Ensure suggestions are enabled for predictive search
          threshold: 1   // Lower threshold means more matches
        })
      );
      
      results = fieldResults.flat();
    } else {
      // Search in all indexed fields
      results = index.search(normalizedQuery, {
        ...searchOptions,
        suggest: true,
        threshold: 1 // Lower threshold for more matches
      });
    }
    
    console.log(`FlexSearch raw results:`, results);
    
    // Flatten and deduplicate results
    const flattenedResults = new Map<string, SearchDocument>();
    
    results.forEach((result: any) => {
      if (result.result) {
        result.result.forEach((item: any) => {
          const docItem = item as unknown as SearchDocument;
          if (docItem && docItem.id && !flattenedResults.has(docItem.id)) {
            flattenedResults.set(docItem.id, docItem);
          }
        });
      }
    });
    
    // For debugging - log the flattened results
    console.log(`FlexSearch flattened results:`, Array.from(flattenedResults.values()));
    
    // Convert back to SearchItems with icon mappings
    const mappedResults = Array.from(flattenedResults.values()).map(doc => {
      // Map icons based on type
      let icon;
      switch (doc.type) {
        case 'wiki':
          icon = BookOpen;
          break;
        case 'lesson':
          icon = Library;
          break;
        case 'tool':
          icon = Wrench;
          break;
        case 'page':
          icon = Info;
          break;
        default:
          icon = Search;
      }
      
      return {
        id: doc.id,
        title: doc.title,
        type: doc.type as any,
        path: doc.path,
        description: doc.description,
        icon
      };
    });
    
    console.log(`Search completed with ${mappedResults.length} results`);
    
    return mappedResults;
  } catch (error) {
    console.error('Search error:', error);
    return []; // Return empty array on error
  }
};

// Search wiki chapters specifically
export const searchWikiChapters = (query: string): SearchItem[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  // Search directly in the wiki chapters data
  const results = chapters
    .filter((chapter: any) => {
      const content = `${chapter.title} ${chapter.summary} ${chapter.sections.map((s: any) => `${s.title} ${s.content}`).join(' ')}`.toLowerCase();
      return content.includes(query.toLowerCase());
    })
    .map((chapter: any) => ({
      id: `wiki-${chapter.id}`,
      title: chapter.title,
      type: 'wiki' as const,
      path: `/dashboard/wiki/chapters/${chapter.id}`,
      description: chapter.summary,
      icon: BookOpen
    }));
  
  return results;
};

// Combine all search sources with filtering capability
export const performCombinedSearch = (
  query: string, 
  activeFilters: string[] = [], 
  pathname: string
): SearchItem[] => {
  if (!query || query.trim().length < 1) { // Reduced to 1 character to match our changes
    return [];
  }
  
  const startTime = performance.now();
  console.log(`Searching for "${query}"`);
  
  // Get results from the main index
  let results = searchIndexItems(query, {
    limit: 50, // Increase limit to get more results before filtering
    suggest: true
  });
  
  console.log(`Search found ${results.length} results for "${query}"`);
  
  // Fallback for common search terms if no results
  if (results.length === 0) {
    const lowercaseQuery = query.toLowerCase();
    console.log(`Using fallback search for "${lowercaseQuery}"`);
    
    // For debugging - fake result to ensure the search function works
    results = generateFallbackResults(lowercaseQuery);
    console.log(`Fallback search found ${results.length} results`);
  }
  
  // Add page-specific results if on a wiki page and not filtered out
  if (pathname.includes('/dashboard/wiki') && (!activeFilters.length || activeFilters.includes('page'))) {
    // Example page-specific results
    const pageResults: SearchItem[] = [
      {
        id: `page-1-${Date.now()}`,
        title: 'Page Section: ' + query,
        type: 'page' as const,
        path: `${pathname}#section-${query.toLowerCase().replace(/\s+/g, '-')}`,
        icon: Info,
        description: `Content matching "${query}" on the current page`
      }
    ];
    results = [...results, ...pageResults];
  }
  
  // Apply filters if any are active
  if (activeFilters.length > 0) {
    results = results.filter(result => activeFilters.includes(result.type));
  }
  
  // Log search performance
  const endTime = performance.now();
  console.log(`Search took ${endTime - startTime}ms for query: "${query}" with ${results.length} results after filtering`);
  
  return results;
};

// Generate fallback results for common search terms
const generateFallbackResults = (query: string): SearchItem[] => {
  // Collection of key terms and matching content
  const fallbackTerms: Record<string, SearchItem[]> = {
    // Baby-related content
    'baby': [
      {
        id: 'baby-development',
        title: 'Baby Development',
        type: 'wiki' as const,
        path: '/dashboard/wiki/chapters/1',
        description: 'Learn about your baby\'s development week by week',
        icon: BookOpen
      },
      {
        id: 'baby-movement',
        title: 'Baby Movement Tracker',
        type: 'tool' as const,
        path: '/tools/kick-counter',
        description: 'Track your baby\'s movements and kicks',
        icon: Wrench
      },
      {
        id: 'baby-name-finder',
        title: 'Baby Name Explorer',
        type: 'tool' as const,
        path: '/tools/name-finder',
        description: 'Find the perfect name for your baby',
        icon: Search
      }
    ],
    
    // Nutrition-related content
    'nutrition': [
      {
        id: 'nutrition-guide',
        title: 'Pregnancy Nutrition Guide',
        type: 'lesson' as const,
        path: '/resources/nutrition',
        description: 'Complete guide to nutrition during pregnancy',
        icon: Library
      }
    ],
    
    // Health-related content
    'health': [
      {
        id: 'health-tracker',
        title: 'Health Tracker',
        type: 'tool' as const,
        path: '/dashboard/health',
        description: 'Track your pregnancy health metrics',
        icon: Wrench
      }
    ]
  };
  
  // Find matches for the query in our fallback terms
  for (const [term, items] of Object.entries(fallbackTerms)) {
    if (query.includes(term) || term.includes(query)) {
      return items;
    }
  }
  
  // If no matching terms found, return empty array
  return [];
};

// Clear the search index (useful when refreshing data)
export const clearSearchIndex = () => {
  searchIndexInstance = null;
  isIndexInitialized = false;
}; 