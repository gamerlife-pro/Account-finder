import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { mockAccounts } from "./data/mockAccounts";
import { XAccount } from "./types";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import Navbar from "./components/Navbar";
import AccountCard from "./components/AccountCard";
import AccountDetailsModal from "./components/AccountDetailsModal";
import SkeletonCard from "./components/SkeletonCard";
import SearchSuggestions from "./components/SearchSuggestions";
import {
  Search,
  Sparkles,
  Award,
  Zap,
  Flame,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  TrendingDown,
  Lock,
  Compass,
  ArrowRight,
  X
} from "lucide-react";

// The Inner App is where the logic resides, to consume the theme context safely!
function InnerApp() {
  const { theme } = useTheme();

  // Navigation and views state
  const [currentView, setCurrentView] = useState<"landing" | "search">("landing");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(""); // empty means 'All'
  const [sortKey, setSortKey] = useState<"followers" | "engagement" | "growth" | "aiScore">("followers");

  // Filters state
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterHighEngagement, setFilterHighEngagement] = useState(false);
  const [filterFastGrowth, setFilterFastGrowth] = useState(false);
  const [filterMostFollowers, setFilterMostFollowers] = useState(false);

  // Modals state
  const [selectedAccount, setSelectedAccount] = useState<XAccount | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Suggestions state
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulated Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Categories list
  const categories = ["AI", "Crypto", "Fitness", "Finance", "Startups", "Coding", "Marketing", "Anime"];

  // Handle navigating & starting category searches from home cards/navbar
  const handleNavigate = (view: "landing" | "search", defaultCategory?: string) => {
    setCurrentView(view);
    if (defaultCategory) {
      setActiveCategory(defaultCategory);
      setSearchQuery(""); // Clear text search to focus on niche clicks
      triggerSimulatedLoading();
    }
  };

  // Simulated search loading delay for beautiful skeleton card demonstration
  const triggerSimulatedLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Close suggestions if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filter & Sort Results derived state
  const processedAccounts = React.useMemo(() => {
    let filtered = [...mockAccounts];

    // 1. Text Query Filter (searches name, username, bio, and tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(q) ||
          acc.username.toLowerCase().includes(q) ||
          acc.bio.toLowerCase().includes(q) ||
          acc.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          acc.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter (exact category matching)
    if (activeCategory) {
      filtered = filtered.filter((acc) => acc.category === activeCategory);
    }

    // 3. Toggle Filters
    if (filterVerified) {
      filtered = filtered.filter((acc) => acc.verified);
    }
    if (filterHighEngagement) {
      filtered = filtered.filter((acc) => acc.engagementRate >= 6.0); // 6% threshold
    }
    if (filterFastGrowth) {
      filtered = filtered.filter((acc) => acc.growthRate >= 8.0); // 8% threshold
    }
    if (filterMostFollowers) {
      filtered = filtered.filter((acc) => acc.followers >= 200000); // 200K followers threshold
    }

    // 4. Sorting logic
    filtered.sort((a, b) => {
      if (sortKey === "followers") return b.followers - a.followers;
      if (sortKey === "engagement") return b.engagementRate - a.engagementRate;
      if (sortKey === "growth") return b.growthRate - a.growthRate;
      if (sortKey === "aiScore") return b.aiScore - a.aiScore;
      return 0;
    });

    return filtered;
  }, [searchQuery, activeCategory, filterVerified, filterHighEngagement, filterFastGrowth, filterMostFollowers, sortKey]);

  // Handle click on suggestions row
  const handleSelectSuggestion = (cat: string) => {
    setSearchQuery("");
    setActiveCategory(cat);
    setCurrentView("search");
    setSuggestionsOpen(false);
    triggerSimulatedLoading();
  };

  const handleSelectAccountSuggestion = (account: XAccount) => {
    setSelectedAccount(account);
    setIsDetailsOpen(true);
    setSuggestionsOpen(false);
  };

  // Clear all filter toggles
  const clearAllFilters = () => {
    setFilterVerified(false);
    setFilterHighEngagement(false);
    setFilterFastGrowth(false);
    setFilterMostFollowers(false);
    setActiveCategory("");
    setSearchQuery("");
    triggerSimulatedLoading();
  };

  // Trigger search from the main Hero component
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView("search");
    setSuggestionsOpen(false);
    triggerSimulatedLoading();
  };

  // Preset top 3 high-score preview models
  const demoPreviewCreators = mockAccounts
    .filter((a) => a.aiScore >= 95)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Dynamic Background Mesh Grid Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-sky-500/5 via-blue-500/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />

      {/* Top Standard Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Primary Application Screens switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          {/* LANDING PAGE SCREEN */}
          {currentView === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* 1. HERO SECTION */}
              <div className="text-center max-w-3xl mx-auto pt-8 sm:pt-16 space-y-6">
                {/* Micro Category Pill Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-500/10 dark:border-sky-500/20 bg-sky-500/[0.04] dark:bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-sky-400 font-sans shadow-sm select-none"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Discover creators &amp; audiences globally
                </motion.div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white font-sans">
                  Find Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">X Accounts</span> Instantly
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-sans font-medium leading-relaxed max-w-2xl mx-auto">
                  Search any niche and discover the most influential Twitter/X creators based on raw engagement, automated AI quality mapping, and growth stats.
                </p>

                {/* Core Center Glass Search Box */}
                <div ref={searchInputRef} className="relative max-w-xl mx-auto pt-4">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400 pointer-events-none">
                      <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search tags, categories, or names (e.g. 'AI', 'Coding', 'Elena')..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSuggestionsOpen(true);
                      }}
                      onFocus={() => setSuggestionsOpen(true)}
                      className="w-full pl-11 pr-32 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 backdrop-blur-md shadow-lg dark:shadow-slate-950/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 px-5 py-2.5 rounded-xl text-xs font-bold font-sans text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all shadow-md shadow-sky-500/10 cursor-pointer"
                    >
                      Search
                    </button>
                  </form>

                  {/* Complete Floating Autocomplete suggestions dropdown */}
                  <SearchSuggestions
                    query={searchQuery}
                    onSelectSuggestion={handleSelectSuggestion}
                    onSelectAccount={handleSelectAccountSuggestion}
                    isOpen={suggestionsOpen}
                  />
                </div>
              </div>

              {/* 2. TRENDING KEYWORDS COHORTS */}
              <div className="max-w-4xl mx-auto text-center space-y-4">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans">
                  🔥 Trending Niches To Explore
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4">
                  {categories.map((cat, idx) => {
                    const iconColor = idx % 2 === 0 ? "text-sky-500" : "text-purple-500";
                    return (
                      <button
                        key={cat}
                        onClick={() => handleNavigate("search", cat)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 hover:border-sky-500/30 dark:hover:border-sky-500/40 bg-white/70 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 font-semibold font-sans text-xs text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer hover:scale-[1.03]"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${iconColor}`} />
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. CORE BENEFITS / FEATURE CARDS */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
                    Engage Smarter Content Analytics
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-sans max-w-md mx-auto">
                    Three modules designed to unpack influencer distribution channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-sm space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 dark:text-sky-400">
                      <Search className="w-5.5 h-5.5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-white font-sans">
                        Smart Multidimensional Search
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                        Filter organically by direct keyword matches, sub-topic hashtags, bios information, and direct category classifications.
                      </p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-sm space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400">
                      <Sparkles className="w-5.5 h-5.5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-white font-sans">
                        Automated Influence Indexing
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                        Our mock intelligence scoring grades profile cohesion from 0-100, verifying content formatting and community trust benchmarks.
                      </p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10 backdrop-blur-sm space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400">
                      <TrendingUp className="w-5.5 h-5.5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-white font-sans">
                        Demographics &amp; Heatmaps
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                        Audit active tweet publication timetables using interactive heatmaps and review geometric regional follower profiles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. DEMO PREVIEW SECTION */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest font-mono">
                      ✨ PREMIUM AUDIENCE INDEX
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans mt-1">
                      Featured High-Tier Profiles
                    </h2>
                    <p className="text-xs text-slate-500 font-sans">
                      Creators scoring exceptional metrics inside the creator ecosystems map.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate("search")}
                    className="group inline-flex items-center gap-1.5 p-1 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <span>Analyze entire database</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {demoPreviewCreators.map((acc, index) => (
                    <AccountCard
                      key={acc.id}
                      account={acc}
                      index={index}
                      onAnalyze={(account) => {
                        setSelectedAccount(account);
                        setIsDetailsOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SEARCH RESULTS SCREEN */}
          {currentView === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* STICKY SEARCH HEADER SECTION */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] glass shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search input refinement */}
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Refine keywords (names, tags)..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        triggerSimulatedLoading();
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all placeholder-slate-400"
                    />
                  </div>

                  {/* Niche select pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap pb-1.5 md:pb-0 scrollbar-none scroll-smooth">
                    <button
                      onClick={() => {
                        setActiveCategory("");
                        triggerSimulatedLoading();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeCategory === ""
                          ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      All Classes
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          triggerSimulatedLoading();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          activeCategory === cat
                            ? "bg-sky-500 text-white dark:bg-sky-500 dark:text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters and sorting dividers */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/40 select-none">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1.5 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Toggle Filters:
                    </span>
                    <button
                      onClick={() => {
                        setFilterVerified(!filterVerified);
                        triggerSimulatedLoading();
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-sans border transition-colors cursor-pointer ${
                        filterVerified
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      Verified ✔️
                    </button>
                    <button
                      onClick={() => {
                        setFilterHighEngagement(!filterHighEngagement);
                        triggerSimulatedLoading();
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-sans border transition-colors cursor-pointer ${
                        filterHighEngagement
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      Engagement Rate (6%+)
                    </button>
                    <button
                      onClick={() => {
                        setFilterFastGrowth(!filterFastGrowth);
                        triggerSimulatedLoading();
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-sans border transition-colors cursor-pointer ${
                        filterFastGrowth
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      Growth Rate (8%+)
                    </button>
                    <button
                      onClick={() => {
                        setFilterMostFollowers(!filterMostFollowers);
                        triggerSimulatedLoading();
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-sans border transition-colors cursor-pointer ${
                        filterMostFollowers
                          ? "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      Followers (200K+)
                    </button>

                    {(filterVerified || filterHighEngagement || filterFastGrowth || filterMostFollowers || searchQuery || activeCategory) && (
                      <button
                        onClick={clearAllFilters}
                        className="px-2 py-1 rounded-md text-[10px] font-bold font-sans text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-colors cursor-pointer border border-rose-500/10 flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Reset
                      </button>
                    )}
                  </div>

                  {/* Sorting metric selector */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
                    </span>
                    <select
                      value={sortKey}
                      onChange={(e) => {
                        setSortKey(e.target.value as any);
                        triggerSimulatedLoading();
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="followers">Follower Scale</option>
                      <option value="engagement">Engagement Ratio</option>
                      <option value="growth">30D Growth Speed</option>
                      <option value="aiScore">AI Quality Score</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SEARCH SUMMARY COUNT */}
              <div className="flex items-center justify-between pb-1 select-none">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>
                      {activeCategory ? `Niche Category: ${activeCategory}` : "Global Database Index"}
                    </span>
                    {searchQuery && (
                      <span className="text-xs sm:text-sm font-semibold font-mono text-slate-400 dark:text-slate-500">
                        (Matching query: &quot;{searchQuery}&quot;)
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {processedAccounts.length} filtered result{processedAccounts.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* RESULTS LIST & GRIDS LAYOUT */}
              {isLoading ? (
                // SKELETON LOADER GRID
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : processedAccounts.length > 0 ? (
                // POPULATED RESULTS CARDS CAROUSEL
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {processedAccounts.map((acc, index) => (
                    <AccountCard
                      key={acc.id}
                      account={acc}
                      index={index}
                      onAnalyze={(account) => {
                        setSelectedAccount(account);
                        setIsDetailsOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                // DETAILED EMPTY STATE PRESENTATION
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-900/10 space-y-4 max-w-xl mx-auto select-none"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                      Zero matching channels detected
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                      We searched for matches inside our indexed database but couldn&apos;t align parameters. Try relaxing toggle filters or resetting search strings.
                    </p>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold font-sans text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Clear Search Filtering
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DETAILED STATS POPUP MODAL OVERLAY */}
      <AccountDetailsModal
        account={selectedAccount}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAccount(null);
        }}
      />

      {/* ABOUT SAAS FRAME MODAL */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="fixed inset-0 bg-slate-950/70 dark:bg-black/90 backdrop-blur-md"
            />
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden z-10"
              >
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-2 select-none">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                    <Award className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                    About X Account Finder
                  </h3>
                  <p className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
                    SaaS Showcase Portfolio
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-sans">
                  <p>
                    <strong>X Account Finder</strong> is a premium simulated SaaS application designed to demonstrate state-of-the-art layout aesthetics, dynamic local searching indices, and full SVG charting integrations inside React and Tailwind.
                  </p>
                  <p>
                    All datasets are self-contained locally as mock models. Profiles representation details represent realistic industry parameters spanning multiple niches like Artificial Intelligence, Cryptography Protocols, FinTech, and Indie Startups.
                  </p>
                  <div className="p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl bg-whitesmoke dark:bg-slate-900/30 text-[10px] font-mono space-y-1 select-all">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Environment Mode:</span>
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">100% Client Offline</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Interface Stack:</span>
                      <span className="text-sky-500">React v19 + Tailwind v4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Animations Engine:</span>
                      <span className="text-pink-500">Framer Motion V12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database Size:</span>
                      <span className="text-amber-500 font-bold">32 Creators / 64+ Real Tweets</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end">
                  <button
                    onClick={() => setIsAboutOpen(false)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                  >
                    Close Showcase Details
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION */}
      <footer className="w-full mt-24 py-12 border-t border-slate-200/50 dark:border-slate-850/80 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">
              X Account <span className="text-sky-500">Finder</span>
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
              Discover and evaluate high-influence creators in any social ecosystem. Built cleanly using local TypeScript indices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <button
              onClick={() => handleNavigate("landing")}
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Discover Hub
            </button>
            <button
              onClick={() => handleNavigate("search")}
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Search Database
            </button>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Platform Overview
            </button>
          </div>

          <div className="space-y-1 text-center md:text-right">
            <p className="text-[10px] text-slate-400 font-medium font-sans">
              Designed with raw UI/UX layout practices.
            </p>
            <p className="text-[9px] text-slate-500 font-mono font-medium leading-none">
              &copy; {new Date().getFullYear()} X Account Finder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Global Main Entry Wrapper providing the context Theme
export default function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}
