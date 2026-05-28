import React from "react";
import { XAccount } from "../types";
import { Search, Sparkles, User } from "lucide-react";
import { mockAccounts } from "../data/mockAccounts";

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion: (suggestion: string) => void;
  onSelectAccount: (account: XAccount) => void;
  isOpen: boolean;
}

export default function SearchSuggestions({
  query,
  onSelectSuggestion,
  onSelectAccount,
  isOpen,
}: SearchSuggestionsProps) {
  if (!isOpen || !query.trim()) return null;

  const searchQuery = query.toLowerCase().trim();

  // Highlight matches
  const categories = ["AI", "Crypto", "Fitness", "Finance", "Startups", "Coding", "Marketing", "Anime"];
  const matchingCategories = categories.filter((cat) => cat.toLowerCase().includes(searchQuery));

  // Matching accounts (by Name, Username, Tags)
  const matchingAccounts = mockAccounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchQuery) ||
      acc.username.toLowerCase().includes(searchQuery) ||
      acc.tags.some((t) => t.toLowerCase().includes(searchQuery))
  );

  const hasSuggestions = matchingCategories.length > 0 || matchingAccounts.length > 0;

  if (!hasSuggestions) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-lg divide-y divide-slate-100 dark:divide-slate-800/60 select-none">
      {/* Category Suggestions */}
      {matchingCategories.length > 0 && (
        <div className="p-2">
          <small className="px-3 py-1 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">
            Filter by Niche
          </small>
          <div className="space-y-0.5">
            {matchingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectSuggestion(cat)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Search in &quot;{cat}&quot; niche</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Account Profile Matches */}
      {matchingAccounts.length > 0 && (
        <div className="p-2">
          <small className="px-3 py-1 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">
            Matching Influencers ({matchingAccounts.length})
          </small>
          <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-thin">
            {matchingAccounts.slice(0, 5).map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => onSelectAccount(acc)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <img
                    src={acc.profileImage}
                    alt={acc.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      @{acc.username} • {acc.category}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-sky-500 dark:text-sky-400 flex items-center space-x-0.5">
                  <span>Score: {acc.aiScore}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
