import React from 'react';
import { motion } from 'framer-motion';
import { Star, BarChart3 } from 'lucide-react';
import { LibraryItem } from '../types';

interface RatingChartProps {
  items: LibraryItem[];
}

export const RatingChart: React.FC<RatingChartProps> = ({ items }) => {
  const ratedItems = items.filter((i) => i.rating !== null && i.rating !== undefined);
  const total = ratedItems.length;

  // Buckets from 10 down to 0 (rounding to integer bucket)
  const buckets: { score: number; count: number; percentage: number }[] = [];

  for (let score = 10; score >= 1; score--) {
    const count = ratedItems.filter((i) => Math.round(i.rating!) === score).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    buckets.push({ score, count, percentage });
  }

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-sm text-zinc-100 uppercase tracking-wider">
            Rating Distribution ({total} rated)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>Scale 1 - 10</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {buckets.map(({ score, count, percentage }) => {
          const widthPercent = (count / maxCount) * 100;

          // Color gradient based on score
          const barColor =
            score >= 9
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
              : score >= 7
              ? 'bg-gradient-to-r from-purple-500 to-indigo-400'
              : score >= 5
              ? 'bg-gradient-to-r from-cyan-600 to-blue-500'
              : 'bg-zinc-700';

          return (
            <div key={score} className="flex items-center gap-3 text-xs">
              <span className="w-6 font-bold text-zinc-400 text-right">{score}★</span>

              <div className="flex-1 h-3 bg-zinc-950/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>

              <span className="w-12 text-right font-mono text-[11px] text-zinc-400">
                {count} ({Math.round(percentage)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
