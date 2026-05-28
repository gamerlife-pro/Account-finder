import React from "react";
import { motion } from "motion/react";
import { XAccount } from "../types";
import { CheckCircle, BarChart3, TrendingUp, Users, ExternalLink, Sparkles } from "lucide-react";

interface AccountCardProps {
  key?: React.Key;
  account: XAccount;
  onAnalyze: (account: XAccount) => void;
  index: number;
}

export default function AccountCard({ account, onAnalyze, index }: AccountCardProps) {
  // Format followers count elegantly
  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // Dedicated theme colors per category
  const categoryThemes: Record<XAccount["category"], { border: string; text: string; bg: string; dot: string }> = {
    AI: {
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      dot: "bg-emerald-500",
    },
    Crypto: {
      border: "border-purple-500/20 dark:border-purple-500/30",
      text: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      dot: "bg-purple-500",
    },
    Fitness: {
      border: "border-amber-500/20 dark:border-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      dot: "bg-amber-500",
    },
    Finance: {
      border: "border-rose-500/20 dark:border-rose-500/30",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      dot: "bg-rose-500",
    },
    Startups: {
      border: "border-indigo-500/20 dark:border-indigo-500/30",
      text: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      dot: "bg-indigo-500",
    },
    Coding: {
      border: "border-sky-500/20 dark:border-sky-500/30",
      text: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      dot: "bg-sky-500",
    },
    Marketing: {
      border: "border-orange-500/20 dark:border-orange-500/30",
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-500/10",
      dot: "bg-orange-500",
    },
    Anime: {
      border: "border-pink-500/20 dark:border-pink-500/30",
      text: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-500/10",
      dot: "bg-pink-500",
    },
  };

  const currentTheme = categoryThemes[account.category] || categoryThemes.AI;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between p-4.5 rounded-2xl border border-slate-200/65 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] glass card-hover transition-all shadow-sm select-all"
    >
      {/* Dynamic Background subtle grid light effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-sky-500/[0.01] dark:to-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Card Header Profile Rows */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={account.profileImage}
                alt={account.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-slate-200/80 dark:border-blue-500 shadow-sm shrink-0"
              />
              {/* Optional verification circle */}
              {account.verified && (
                <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-blue-500 dark:text-blue-400 bg-white dark:bg-[#050505] rounded-full fill-white dark:fill-[#050505]" />
              )}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors font-sans leading-tight">
                  {account.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                @{account.username}
              </p>
            </div>
          </div>

          {/* Glowing AI Influence Score Indicator */}
          <div className="relative px-2 py-0.5 rounded border border-blue-500/25 bg-blue-500/10 flex items-center space-x-1 shrink-0 select-none">
            <Sparkles className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span className="text-[10px] font-sans font-extrabold text-blue-600 dark:text-blue-400">
              {account.aiScore} AI SCORE
            </span>
          </div>
        </div>

        {/* Account Bio */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed line-clamp-2 h-9 select-all">
          {account.bio}
        </p>

        {/* Niche tags and Category labels */}
        <div className="flex flex-wrap items-center gap-1 mt-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold font-sans ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text}`}
          >
            <span className={`w-1 h-1 rounded-full ${currentTheme.dot}`} />
            {account.category}
          </span>
          {account.tags.slice(0, 3).map((tag, tIdx) => (
            <span
              key={tIdx}
              className="px-2 py-0.5 rounded border border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-white/5 font-mono text-[9px] text-slate-500 dark:text-slate-400 font-medium"
            >
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Row Section */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <span className="flex items-center gap-1 text-[9px] text-slate-400 font-medium font-sans uppercase tracking-wider">
              <Users className="w-2.5 h-2.5 text-slate-400" /> Followers
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-white font-sans leading-tight mt-0.5">
              {formatFollowers(account.followers)}
            </p>
          </div>
          <div>
            <span className="flex items-center gap-1 text-[9px] text-slate-400 font-medium font-sans uppercase tracking-wider">
              <BarChart3 className="w-2.5 h-2.5 text-slate-400" /> Engagement
            </span>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 font-sans leading-tight mt-0.5">
              {account.engagementRate}%
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="flex items-center gap-1 text-[9px] text-slate-400 font-medium font-sans justify-end uppercase tracking-wider">
            <TrendingUp className="w-2.5 h-2.5 text-emerald-500" /> Growth
          </span>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-sans leading-tight mt-0.5">
            +{account.growthRate}%
          </p>
        </div>
      </div>

      {/* Button Interactions */}
      <div className="flex items-center gap-2 mt-3.5 text-center">
        <button
          onClick={() => {
            window.open(`https://x.com/${account.username}`, "_blank");
          }}
          className="flex-1 inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 font-bold font-sans text-[11px] text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </button>
        <button
          onClick={() => onAnalyze(account)}
          className="px-3.5 py-1.5 rounded-lg text-center font-bold font-sans text-[11px] text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-sm shadow-blue-600/10"
        >
          Analyze
        </button>
      </div>
    </motion.div>
  );
}
