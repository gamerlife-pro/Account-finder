import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Sparkles, Menu, X, Rocket, Compass, TrendingUp } from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "search";
  onNavigate: (view: "landing" | "search", defaultCategory?: string) => void;
  onOpenAbout: () => void;
}

export default function Navbar({ currentView, onNavigate, onOpenAbout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-md glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => {
              onNavigate("landing");
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <span className="font-sans font-black text-white text-lg">X</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight font-sans text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Account Finder <span className="text-[9px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">PRO</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-mono leading-none mt-1">
                SaaS UI/UX Showcase
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate("landing")}
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === "landing"
                  ? "text-sky-500 dark:text-sky-400"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" /> Discover
            </button>
            <button
              onClick={() => onNavigate("search")}
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === "search"
                  ? "text-sky-500 dark:text-sky-400"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Search Engine
            </button>
            <button
              onClick={() => onNavigate("search", "AI")}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" /> Top AI Profiles
            </button>
            <button
              onClick={onOpenAbout}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-purple-500" /> About SaaS
            </button>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-3">
            {/* Dark & Light Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all shadow-sm cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {/* Premium Interactive CTA (Aesthetic Only) */}
            <button
              onClick={() => onNavigate("search")}
              className="hidden sm:inline-flex items-center justify-center px-4.5 py-1.5 text-xs font-bold font-sans text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors cursor-pointer"
            >
              Go Pro
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all md:hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-slate-950 p-4 space-y-3 shadow-lg">
          <button
            onClick={() => {
              onNavigate("landing");
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-all ${
              currentView === "landing"
                ? "bg-sky-500/15 text-sky-500"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-900"
            }`}
          >
            <Compass className="w-4 h-4" /> Discover Hub
          </button>
          <button
            onClick={() => {
              onNavigate("search");
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-all ${
              currentView === "search"
                ? "bg-sky-500/15 text-sky-500"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Search Engine
          </button>
          <button
            onClick={() => {
              onNavigate("search", "AI");
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-900 flex items-center gap-2.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" /> Top AI Creators
          </button>
          <button
            onClick={() => {
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left p-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-900 flex items-center gap-2.5 transition-all"
          >
            <Rocket className="w-4 h-4 text-purple-500" /> About SaaS Showcase
          </button>

          <div className="pt-2 border-t border-slate-200/55 dark:border-slate-800/80">
            <button
              onClick={() => {
                onNavigate("search");
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-md"
            >
              Get Started Instantly
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
