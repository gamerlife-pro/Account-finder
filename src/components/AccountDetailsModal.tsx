import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XAccount } from "../types";
import {
  X,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Repeat2,
  Heart,
  Eye,
  Award,
  Sparkles,
  ExternalLink,
  Target,
  UserCheck
} from "lucide-react";
import {
  FollowersHistoryChart,
  TweetActivityHeatmap,
  AudienceInsightsDashboard
} from "./AnalyticsCharts";

interface AccountDetailsModalProps {
  account: XAccount | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDetailsModal({ account, isOpen, onClose }: AccountDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "tweets">("analytics");

  // Keep scroll locked when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!account) return null;

  const totalLikes = account.recentTweets.reduce((acc, curr) => acc + curr.likes, 0);
  const totalRetweets = account.recentTweets.reduce((acc, curr) => acc + curr.retweets, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop Mask Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/65 dark:bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container Positioning */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-[#050505] border border-slate-200/80 dark:border-white/10 glass shadow-2xl overflow-hidden z-10"
            >
              {/* Close Button Trigger floating right */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-950/25 dark:bg-slate-950/50 hover:bg-slate-950/40 text-white border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Close analytics modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* 1. Header Banner Image & Avatar */}
              <div className="relative h-44 sm:h-52 bg-slate-150 dark:bg-slate-900 select-none">
                <img
                  src={account.bannerImage}
                  alt={`${account.name}'s banner`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Visual Gradient layer overlaying banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-black/10" />
              </div>

              {/* Overlapping Info Rows */}
              <div className="px-5 sm:px-8 pb-4 relative mt-[-50px] sm:mt-[-60px] z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end space-x-4">
                  <div className="relative shrink-0">
                    <img
                      src={account.profileImage}
                      alt={account.name}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-950 shadow-md"
                    />
                    {account.verified && (
                      <CheckCircle className="absolute bottom-1 right-1 w-6 h-6 text-blue-500 bg-white dark:bg-slate-950 rounded-full fill-white dark:fill-slate-950" />
                    )}
                  </div>
                  <div className="mb-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none flex items-center gap-1.5 font-sans">
                      {account.name}
                    </h2>
                    <p className="text-sm text-slate-500 font-mono mt-0.5 select-all">
                      @{account.username}
                    </p>
                  </div>
                </div>

                {/* Growth and Verification metrics row */}
                <div className="flex flex-wrap items-center gap-2 mb-2 select-none">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" /> +{account.growthRate}% Growth
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sky-500/10 bg-sky-500/[0.04] text-xs font-bold text-sky-600 dark:text-sky-400 font-sans shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> AI Quality Index: {account.aiScore}
                  </span>
                </div>
              </div>

              {/* 2. Profile Bios Description */}
              <div className="px-5 sm:px-8 space-y-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed select-all">
                  {account.bio}
                </p>

                {/* Grid Layout of Core Stat Widgets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
                  <div className="p-3 border border-slate-200/50 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/[0.02] glass shadow-sm">
                    <div className="flex items-center text-slate-400 gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 font-sans">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Followers
                    </div>
                    <div className="text-base font-black text-slate-800 dark:text-white font-sans leading-none">
                      {account.followers.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200/50 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/[0.02] glass shadow-sm">
                    <div className="flex items-center text-slate-400 gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 font-sans">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-400" /> Engagement
                    </div>
                    <div className="text-base font-black text-blue-500 dark:text-blue-400 font-sans leading-none">
                      {account.engagementRate}%
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200/50 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/[0.02] glass shadow-sm">
                    <div className="flex items-center text-slate-400 gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 font-sans">
                      <Heart className="w-3.5 h-3.5 text-rose-500/80" /> Avg Likes
                    </div>
                    <div className="text-base font-black text-slate-800 dark:text-white font-sans leading-none">
                      {Math.round(totalLikes / account.recentTweets.length).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200/50 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/[0.02] glass shadow-sm">
                    <div className="flex items-center text-slate-400 gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 font-sans">
                      <Award className="w-3.5 h-3.5 text-indigo-500/80" /> Category
                    </div>
                    <div className="text-base font-black text-indigo-500 dark:text-indigo-400 font-sans leading-none">
                      {account.category}
                    </div>
                  </div>
                </div>

                {/* 3. Navigation Tab controls */}
                <div className="flex border-b border-slate-200/60 dark:border-white/10 pt-2 select-none">
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`px-4 py-2.5 font-bold font-sans text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activeTab === "analytics"
                        ? "border-sky-500 text-sky-500 dark:text-sky-400 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" /> Creator Analytics Hub
                  </button>
                  <button
                    onClick={() => setActiveTab("tweets")}
                    className={`px-4 py-2.5 font-bold font-sans text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activeTab === "tweets"
                        ? "border-sky-500 text-sky-500 dark:text-sky-400 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Calendar className="w-4 h-4" /> Top Recent Activity
                  </button>
                </div>
              </div>

              {/* 4. Scrollable Detail content wrapper */}
              <div className="p-5 sm:p-8 max-h-[400px] overflow-y-auto scrollbar-thin space-y-6">
                <AnimatePresence mode="wait">
                  {activeTab === "analytics" ? (
                    <motion.div
                      key="analytics-view"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Grid structure for charts */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 6-Month Followers growth */}
                        <FollowersHistoryChart data={account.followerHistory} />

                        {/* Extra quick audit highlights block */}
                        <div className="p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-900/60 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-sky-500" /> AI Growth Audit
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                              This channel exhibits high-density semantic cohesion. High growth levels (
                              <span className="font-bold text-emerald-500">+{account.growthRate}%</span>
                              ) are fueled by consistent deep discussion within the tag spheres of{" "}
                              <span className="font-semibold text-sky-500">
                                {account.tags[0]}
                              </span>{" "}
                              and <span className="font-semibold text-sky-500">{account.tags[1]}</span>.
                            </p>
                          </div>
                          <div className="mt-4 space-y-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40 text-[11px] font-sans text-slate-500">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-emerald-500" />
                              <span>Organic audience validation rate: 98.4%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span>Influence power coefficient: Premium</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tweet Activity Map */}
                      <TweetActivityHeatmap heatmap={account.tweetHeatmap} />

                      {/* Demographics analysis blocks */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">
                            Audience Demographics & Insights
                          </h4>
                          <p className="text-xs text-slate-500 font-mono">
                            AI-extrapolated follower metadata profiles
                          </p>
                        </div>
                        <AudienceInsightsDashboard
                          regions={account.audienceInsights.regions}
                          genders={account.audienceInsights.genders}
                          professions={account.audienceInsights.professions}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tweets-view"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Popular topics widget */}
                      <div className="p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-xl bg-whitesmoke dark:bg-slate-900/30">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans mb-3 flex items-center gap-1.5">
                          🏷️ Popular Topics Share
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {account.popularTopics.map((topic, index) => (
                            <div
                              key={index}
                              className="px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-2"
                            >
                              <span className="font-bold text-sky-500">#{topic.name}</span>
                              <span className="w-[1.5px] h-3 bg-slate-200 dark:bg-slate-800" />
                              <span className="text-slate-400 font-medium">{topic.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline of tweets */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">
                          Recent Top Content Analyzed
                        </h4>
                        <div className="border border-slate-200/60 dark:border-slate-800/70 rounded-xl divide-y divide-slate-200/60 dark:divide-slate-800/70 overflow-hidden bg-white dark:bg-slate-950">
                          {account.recentTweets.map((tweet) => (
                            <div
                              key={tweet.id}
                              className="p-4.5 space-y-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2.5">
                                  <img
                                    src={account.profileImage}
                                    alt={account.name}
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans block">
                                      {account.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      @{account.username}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                  {tweet.timestamp}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                                {tweet.content}
                              </p>

                              {/* Tweet metrics log */}
                              <div className="flex items-center space-x-6 pt-1 text-[11px] font-mono font-medium text-slate-400 select-none">
                                <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer transition-colors">
                                  <MessageSquare className="w-3.5 h-3.5" />{" "}
                                  {tweet.replies.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors">
                                  <Repeat2 className="w-3.5 h-3.5" /> {tweet.retweets.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer transition-colors">
                                  <Heart className="w-3.5 h-3.5 fill-transparent hover:fill-rose-500/20" />{" "}
                                  {tweet.likes.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" /> {tweet.impressions.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. Footer Actions */}
              <div className="p-4 border-t border-slate-200/55 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between select-none">
                <p className="text-[11px] text-slate-400 font-medium font-sans">
                  *Analytics and indices are mock estimates calculated by predictive model overlays.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold font-sans text-slate-600 dark:text-slate-300 border border-slate-250 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                  >
                    Done Analyzing
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://x.com/${account.username}`, "_blank");
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold font-sans text-white bg-gradient-to-br from-sky-500 to-blue-600 shadow-md shadow-sky-500/10 rounded-xl hover:from-sky-600 hover:to-blue-700 cursor-pointer"
                  >
                    <span>View Profile on X</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
