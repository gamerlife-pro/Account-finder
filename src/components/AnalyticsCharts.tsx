import React, { useState } from "react";
import { motion } from "motion/react";
import { FollowerHistoryPoint } from "../types";

// ==========================================
// 1. FOLLOWERS GROWTH CURVE CHART
// ==========================================
interface FollowersChartProps {
  data: FollowerHistoryPoint[];
}

export function FollowersHistoryChart({ data }: FollowersChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 220;
  const paddingX = 50;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Data processing bounds
  const counts = data.map((d) => d.count);
  const minVal = Math.min(...counts) * 0.99; // Give a tiny bottom buffer
  const maxVal = Math.max(...counts) * 1.01; // Give a tiny top buffer
  const valRange = maxVal - minVal;

  // Map point index and value to SVG coordinates
  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y };
  };

  const coords = data.map((d, i) => getCoordinates(i, d.count));

  // Generate SVG Path for line
  let pathD = "";
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    // Use cubic bezier control points for a smooth curve
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const controlX1 = curr.x + (next.x - curr.x) / 3;
      const controlY1 = curr.y;
      const controlX2 = curr.x + (2 * (next.x - curr.x)) / 3;
      const controlY2 = next.y;
      pathD += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }
  }

  // Generate SVG Path for filled gradient area
  let areaD = "";
  if (coords.length > 0) {
    areaD = pathD + ` L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
  }

  // Format big numbers
  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="relative w-full p-4 border border-slate-200/50 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/[0.03] glass md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">
            Follower Growth Trend
          </h4>
          <p className="text-xs text-slate-500 font-mono">6-Month historical analysis</p>
        </div>
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-right"
          >
            <div className="text-xs font-semibold text-sky-500 dark:text-sky-400 font-mono">
              {data[hoveredPoint].date}
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">
              {data[hoveredPoint].count.toLocaleString()}
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Dark Mode Gradient */}
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            {/* Filter for glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingY + ratio * chartHeight;
            const value = maxVal - ratio * valRange;
            return (
              <g key={index} opacity="0.15" className="stroke-slate-400 dark:stroke-slate-500">
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} strokeDasharray="3,3" strokeWidth="1" />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="currentColor"
                  stroke="none"
                  className="font-mono text-[9px] font-medium"
                >
                  {formatFollowers(value)}
                </text>
              </g>
            );
          })}

          {/* Area under the path */}
          {areaD && (
            <motion.path
              d={areaD}
              fill="url(#chartAreaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          )}

          {/* The curved line */}
          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#chartLineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              filter="url(#glow)"
            />
          )}

          {/* Bottom Labels (Months) */}
          {data.map((point, index) => {
            const coord = coords[index];
            return (
              <g key={index}>
                <text
                  x={coord.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 font-mono text-[10px]"
                >
                  {point.date}
                </text>
                {/* Horizontal reference lines for hovered element */}
                {hoveredPoint === index && (
                  <line
                    x1={coord.x}
                    y1={paddingY}
                    x2={coord.x}
                    y2={height - paddingY}
                    className="stroke-sky-500/25 dark:stroke-sky-400/40"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                )}
              </g>
            );
          })}

          {/* Interactive touch targets / dots */}
          {coords.map((coord, index) => {
            const isHovered = hoveredPoint === index;
            return (
              <g key={index} className="cursor-pointer">
                {/* Visual marker dot */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isHovered ? 7 : 4}
                  className="fill-white dark:fill-slate-950 stroke-sky-500 dark:stroke-sky-400 transition-all duration-150"
                  strokeWidth="2.5"
                />
                {/* Hidden large trigger area for hover ease */}
                <rect
                  x={coord.x - chartWidth / (data.length * 2)}
                  y={paddingY}
                  width={chartWidth / (data.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 2. TWEET HEATMAP GRID CHART
// ==========================================
interface HeatmapProps {
  heatmap: number[][]; // 7x24 grid
}

export function TweetActivityHeatmap({ heatmap }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number; val: number } | null>(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [
    "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a",
    "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p",
  ];

  // Map intensity value (0 to 10) to dark/light color shades
  const getColorClass = (val: number) => {
    if (val === 0) return "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800/50";
    if (val <= 2) return "bg-sky-500/10 text-sky-600/30 border-sky-500/5";
    if (val <= 4) return "bg-sky-500/30 text-sky-500 border-sky-500/10";
    if (val <= 6) return "bg-sky-500/50 text-white border-sky-500/20";
    if (val <= 8) return "bg-sky-600 text-white border-sky-600/30";
    return "bg-blue-600 dark:bg-blue-500 text-white border-blue-600/40 shadow-sm shadow-sky-500/20";
  };

  return (
    <div className="p-4 border border-slate-200/50 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/[0.03] glass">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">
            Tweet Activity Heatmap
          </h4>
          <p className="text-xs text-slate-500 font-mono">Weekly post frequency by hour of day</p>
        </div>
        {hoveredCell !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
          >
            {days[hoveredCell.day]} @ {hours[hoveredCell.hour]}:{" "}
            <span className="font-bold text-sky-500 dark:text-sky-400">
              {hoveredCell.val === 0 ? "No active tweets" : `${hoveredCell.val} tweets/hr`}
            </span>
          </motion.div>
        )}
      </div>

      <div className="flow-root overflow-x-auto whitespace-nowrap pb-2 align-middle scrollbar-thin">
        <div className="min-w-[620px] select-none p-1">
          {/* Hour labels */}
          <div className="flex ml-8 mb-1.5">
            {hours.map((hr, idx) => (
              <div
                key={idx}
                className="w-5 text-center text-[8px] font-mono text-slate-400 font-semibold"
              >
                {idx % 3 === 0 ? hr : ""}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-1">
            {days.map((day, dIdx) => (
              <div key={dIdx} className="flex items-center">
                <span className="w-8 text-[10px] font-mono font-medium text-slate-400 text-left">
                  {day}
                </span>
                <div className="flex gap-[3px]">
                  {Array.from({ length: 24 }).map((_, hIdx) => {
                    const val = heatmap[dIdx]?.[hIdx] ?? 0;
                    return (
                      <div
                        key={hIdx}
                        onMouseEnter={() => setHoveredCell({ day: dIdx, hour: hIdx, val })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-5 h-5 rounded-[4px] border transition-all duration-150 cursor-pointer hover:scale-110 hover:z-10 ${getColorClass(val)}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end mt-4 text-[9px] font-mono text-slate-500 space-x-1.5 mr-1">
            <span>Sparse</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-500/20 border border-sky-500/10" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-500/50 border border-sky-500/20" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-600 border border-sky-600/20" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-blue-600 dark:bg-blue-500 border border-blue-600/20" />
            <span>Frequent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. AUDIENCE DEMOGRAPHIC GRAPH
// ==========================================
interface DemographicProps {
  regions: { label: string; percentage: number }[];
  genders: { label: string; percentage: number }[];
  professions: { label: string; percentage: number }[];
}

export function AudienceInsightsDashboard({ regions, genders, professions }: DemographicProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Regions bar chart */}
      <div className="p-4 border border-slate-200/50 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/[0.03] glass">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans mb-3 flex items-center">
          🌍 Geographic Distribution
        </h4>
        <div className="space-y-2.5">
          {regions.map((reg, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-sans text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">{reg.label}</span>
                <span className="font-mono text-sky-500 dark:text-sky-400 font-semibold">{reg.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${reg.percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 shadow-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professions & Gender Splits combo */}
      <div className="p-4 border border-slate-200/50 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/[0.03] glass flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans mb-3 flex items-center">
            💼 Audience Professions
          </h4>
          <div className="space-y-2.5">
            {professions.map((prof, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-sans text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{prof.label}</span>
                  <span className="font-mono text-blue-500 dark:text-sky-400 font-semibold">{prof.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/80">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prof.percentage}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Breakdown Pill */}
        <div className="mt-4 pt-4 border-t border-slate-200/40 dark:border-slate-800/50">
          <h5 className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-2">
            Gender Balance split
          </h5>
          <div className="w-full h-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/50 flex text-[10px] text-white font-mono font-bold leading-normal">
            {genders.map((g, idx) => {
              const bg = idx === 0 ? "bg-sky-500 dark:bg-sky-500/90" : idx === 1 ? "bg-purple-500 dark:bg-purple-500/90" : "bg-slate-400 dark:bg-slate-600";
              return (
                <motion.div
                  key={idx}
                  initial={{ width: 0 }}
                  animate={{ width: `${g.percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`${bg} h-full first:rounded-l-full last:rounded-r-full transition-all flex items-center justify-center`}
                  title={`${g.label}: ${g.percentage}%`}
                >
                  {g.percentage > 15 ? `${g.percentage}%` : ""}
                </motion.div>
              );
            })}
          </div>
          <div className="flex gap-4 justify-start mt-2 text-[10px] font-sans text-slate-500">
            {genders.map((g, idx) => {
              const dot = idx === 0 ? "bg-sky-500" : idx === 1 ? "bg-purple-500" : "bg-slate-400";
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span>
                    {g.label} ({g.percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
