'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Bookmark,
  Clock,
  ArrowRight,
  Star,
  TrendingUp,
  BookOpen,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useSearchStore } from '@/store/search-store';

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define interfaces for data types
interface Article {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  readTime: number;
  slug: string;
  isNew: boolean;
  isBookmarked?: boolean;
  image?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function WikiPage() {
  // Use the global search store for search query
  const { searchQuery, setSearchQuery } = useSearchStore();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Filter articles based on search and category filters
  useEffect(() => {
    let filtered = [...articles];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(article => 
        selectedCategories.includes(article.category)
      );
    }
    
    // Apply tab filter
    if (activeTab === 'bookmarked') {
      filtered = filtered.filter(article => article.isBookmarked);
    } else if (activeTab === 'trending') {
      filtered = filtered.filter(article => article.isTrending);
    } else if (activeTab === 'featured') {
      filtered = filtered.filter(article => article.isFeatured);
    }
    
    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategories, articles, activeTab]);

  // Toggle category selection
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleBookmark = (articleId: number) => {
    const updatedArticles = articles.map(article => {
      if (article.id === articleId) {
        return { ...article, isBookmarked: !article.isBookmarked };
      }
      return article;
    });
    
    // Update the articles array
    (articles as Article[]) = updatedArticles;
    
    // Update filtered list
    setFilteredArticles(prev => 
      prev.map(article => {
        if (article.id === articleId) {
          return { ...article, isBookmarked: !article.isBookmarked };
        }
        return article;
      })
    );
    
    // Update bookmarked list
    setBookmarkedArticles(
      updatedArticles.filter(article => article.isBookmarked)
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="flex flex-col space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Pregnancy Wiki</h1>
            <p className="text-muted-foreground text-center mb-10">Explore our comprehensive pregnancy and parenting knowledge base</p>
          
            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-12">
              <div className="flex items-center bg-card shadow-lg rounded-full p-1 border">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search the wiki..." 
                    className="pl-12 pr-4 py-6 border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full mr-1">
                      <Filter className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Filter Articles</SheetTitle>
                      <SheetDescription>
                        Select categories to narrow down your search
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(category => (
                            <Badge 
                              key={category.id}
                              variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleCategory(category.name)}
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button onClick={() => setSelectedCategories([])}>
                        Reset Filters
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6">
          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-card/80 backdrop-blur-sm border">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  All Articles
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Star className="h-4 w-4 mr-2" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="bookmarked" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmarked
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <ArticleGrid 
                articles={filteredArticles} 
                toggleBookmark={toggleBookmark} 
              />
            </TabsContent>
            
            <TabsContent value="featured" className="m-0">
              <ArticleGrid 
                articles={filteredArticles} 
                toggleBookmark={toggleBookmark} 
              />
            </TabsContent>
            
            <TabsContent value="trending" className="m-0">
              <ArticleGrid 
                articles={filteredArticles} 
                toggleBookmark={toggleBookmark} 
              />
            </TabsContent>
            
            <TabsContent value="bookmarked" className="m-0">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-20">
                  <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No bookmarked articles</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Save your favorite articles for quick access by clicking the bookmark icon on any article.
                  </p>
                </div>
              ) : (
                <ArticleGrid 
                  articles={filteredArticles} 
                  toggleBookmark={toggleBookmark} 
                />
              )}
            </TabsContent>
          </Tabs>

          {/* Categories Section */}
          <div className="mt-16 mb-24">
            <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleCategory(category.name)}
                  className="bg-card hover:bg-card/90 border rounded-xl p-4 text-center cursor-pointer"
                  style={{ borderColor: `${category.color}30` }}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: category.color }} />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} articles</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Highlight */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="outline" className="bg-background mb-3">Weekly Highlight</Badge>
                <h2 className="text-3xl font-bold mb-4">Essential Guide to Prenatal Nutrition</h2>
                <p className="text-muted-foreground mb-6">
                  Discover what nutrients you and your baby need at each stage of pregnancy, 
                  with meal plans and recipes to help you stay on track.
                </p>
                <Button asChild>
                  <Link href="/dashboard/wiki/articles/prenatal-nutrition-guide">
                    Read the Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="text-[120px]">🥗</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Article Grid Component
function ArticleGrid({ articles, toggleBookmark }: { articles: Article[], toggleBookmark: (id: number) => void }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No articles found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
          className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          {/* Article Image */}
          <div className="relative h-48 bg-muted">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="text-[80px]">
                {article.category === 'Nutrition' && '🥗'}
                {article.category === 'Health' && '❤️'}
                {article.category === 'Development' && '👶'}
                {article.category === 'Preparation' && '📝'}
                {article.category === 'Parenting' && '👨‍👩‍👧'}
                {article.category === 'Wellness' && '🧘‍♀️'}
                {!['Nutrition', 'Health', 'Development', 'Preparation', 'Parenting', 'Wellness'].includes(article.category) && '📚'}
              </div>
            </div>
            
            {/* Category Badge */}
            <Badge 
              className="absolute top-3 left-3 z-20"
              style={{
                backgroundColor: categories.find(c => c.name === article.category)?.color || '#7C3AED'
              }}
            >
              {article.category}
            </Badge>
            
            {/* Bookmark Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-20 text-white hover:text-white hover:bg-black/20"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark(article.id);
                    }}
                  >
                    <Bookmark 
                      className={`h-5 w-5 ${article.isBookmarked ? 'fill-white' : ''}`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {article.isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Title on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <h3 className="font-bold text-lg text-white">{article.title}</h3>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
            <div className="line-clamp-3 text-sm mb-4">{article.excerpt}</div>
            
            <div className="flex items-center justify-between mt-auto pt-2 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime} min read
              </div>
              <Link 
                href={`/dashboard/wiki/articles/${article.slug}`}
                className="text-primary hover:underline inline-flex items-center text-sm font-medium"
              >
                Read more
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
          
          {/* New Badge */}
          {article.isNew && (
            <div className="absolute top-3 right-3 z-20">
              <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
            </div>
          )}
          
          {/* Trending Badge */}
          {article.isTrending && (
            <div className="absolute top-10 right-3 z-20">
              <Badge variant="outline" className="bg-orange-500/80 text-white border-orange-400 hover:bg-orange-600">
                <TrendingUp className="h-3 w-3 mr-1" /> Trending
              </Badge>
            </div>
          )}
          
          {/* Link overlay for the entire card (except bookmark button) */}
          <Link href={`/dashboard/wiki/articles/${article.slug}`} className="absolute inset-0 z-10">
            <span className="sr-only">Read {article.title}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// Enhanced article data with additional properties
const articles: Article[] = [
  {
    id: 1,
    title: "Nutrition Guide for the Second Trimester",
    description: "Essential nutrients for weeks 14-26",
    excerpt: "The second trimester is a critical period for both maternal and fetal health. This guide explores the key nutrients needed during this time, including protein, iron, calcium, and omega-3 fatty acids.",
    category: "Nutrition",
    readTime: 5,
    slug: "nutrition-second-trimester",
    isNew: true,
    isBookmarked: false,
    isFeatured: true,
    isTrending: false
  },
  {
    id: 2,
    title: "Managing Pregnancy Fatigue",
    description: "Natural ways to boost your energy",
    excerpt: "Feeling exhausted? You're not alone. Pregnancy fatigue is common, especially during the first and third trimesters. Learn about safe, natural ways to boost your energy levels.",
    category: "Wellness",
    readTime: 4,
    slug: "managing-pregnancy-fatigue",
    isNew: false,
    isBookmarked: true,
    isFeatured: false,
    isTrending: true
  },
  {
    id: 3,
    title: "Understanding Prenatal Tests",
    description: "A comprehensive guide to screening options",
    excerpt: "Prenatal testing can provide valuable information about your baby's health. This article explains different screening and diagnostic tests, when they're performed, and what results mean.",
    category: "Medical",
    readTime: 8,
    slug: "prenatal-tests-explained",
    isNew: false,
    isBookmarked: false,
    isFeatured: true,
    isTrending: false
  },
  {
    id: 4,
    title: "Safe Exercise During Pregnancy",
    description: "Staying active for you and baby",
    excerpt: "Regular physical activity during pregnancy has numerous benefits. Learn which exercises are safe, recommended modifications, and signs to stop activity immediately.",
    category: "Fitness",
    readTime: 6,
    slug: "safe-pregnancy-exercises",
    isNew: false,
    isBookmarked: false,
    isFeatured: false,
    isTrending: true
  },
  {
    id: 5,
    title: "Preparing Your Home for Baby",
    description: "Essential nesting checklist",
    excerpt: "The nesting instinct is real! Channel that energy effectively with this comprehensive checklist for preparing your home before baby arrives, from nursery setup to safety proofing.",
    category: "Planning",
    readTime: 7,
    slug: "home-preparation-checklist",
    isNew: true,
    isBookmarked: false,
    isFeatured: false,
    isTrending: false
  },
  {
    id: 6,
    title: "Mental Health During Pregnancy",
    description: "Recognizing and managing anxiety and depression",
    excerpt: "Pregnancy can bring emotional challenges. This guide helps identify symptoms of prenatal anxiety and depression, with strategies for coping and when to seek professional help.",
    category: "Mental Health",
    readTime: 5,
    slug: "pregnancy-mental-health",
    isNew: false,
    isBookmarked: false,
    isFeatured: true,
    isTrending: false
  },
  {
    id: 7,
    title: "Baby's Development: First Trimester",
    description: "Weekly changes in your growing baby",
    excerpt: "The first trimester is a time of incredible development for your baby. Learn about the amazing transformations happening week by week in these early stages of pregnancy.",
    category: "Development",
    readTime: 6,
    slug: "first-trimester-development",
    isNew: false,
    isBookmarked: false,
    isFeatured: false,
    isTrending: false
  },
  {
    id: 8,
    title: "Pregnancy Sleep Solutions",
    description: "Getting rest when it seems impossible",
    excerpt: "Sleep can become elusive during pregnancy. This article offers practical solutions to common sleep challenges, including position tips, pillow arrangements, and relaxation techniques.",
    category: "Wellness",
    readTime: 4,
    slug: "pregnancy-sleep-solutions",
    isNew: false,
    isBookmarked: false,
    isFeatured: false,
    isTrending: true
  },
  {
    id: 9,
    title: "Understanding Pregnancy Hormones",
    description: "The science behind your changing body",
    excerpt: "Hormones drive the incredible changes in your body during pregnancy. Learn about how estrogen, progesterone, hCG and others affect everything from morning sickness to mood swings.",
    category: "Medical",
    readTime: 7,
    slug: "pregnancy-hormones",
    isNew: true,
    isBookmarked: false,
    isFeatured: false,
    isTrending: false
  }
];

// Category data
const categories: Category[] = [
  { id: "cat1", name: "Nutrition", count: 12, color: "#10B981" }, // green
  { id: "cat2", name: "Wellness", count: 15, color: "#8B5CF6" }, // purple
  { id: "cat3", name: "Medical", count: 18, color: "#EF4444" }, // red
  { id: "cat4", name: "Fitness", count: 8, color: "#3B82F6" }, // blue
  { id: "cat5", name: "Planning", count: 10, color: "#F59E0B" }, // amber
  { id: "cat6", name: "Mental Health", count: 7, color: "#EC4899" }, // pink
  { id: "cat7", name: "Development", count: 14, color: "#06B6D4" }, // cyan
]; 