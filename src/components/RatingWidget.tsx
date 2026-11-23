import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingWidgetProps {
  value: number | null;
  onChange: (val: number | null) => void;
  size?: 'sm' | 'md' | 'lg';
  showPresets?: boolean;
}

export const RatingWidget: React.FC<RatingWidgetProps> = ({
  value,
  onChange,
  size = 'md',
  showPresets = true,
}) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const displayVal = hoverVal !== null ? hoverVal : value;

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const PRESETS = [
    { label: '10 Masterpiece', val: 10, color: 'hover:border-amber-400 hover:text-amber-400' },
    { label: '9.0 Great', val: 9, color: 'hover:border-purple-400 hover:text-purple-400' },
    { label: '8.0 Good', val: 8, color: 'hover:border-indigo-400 hover:text-indigo-400' },
    { label: '6.5 Decent', val: 6.5, color: 'hover:border-blue-400 hover:text-blue-400' },
    { label: '4.0 Weak', val: 4, color: 'hover:border-zinc-400 hover:text-zinc-400' },
  ];

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Stars row + score text */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNum) => {
          const filled = displayVal !== null && displayVal >= starNum;
          const half = displayVal !== null && displayVal >= starNum - 0.5 && displayVal < starNum;

          return (
            <button
              key={starNum}
              type="button"
              className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
              onMouseEnter={() => setHoverVal(starNum)}
              onMouseLeave={() => setHoverVal(null)}
              onClick={() => onChange(value === starNum ? null : starNum)}
              title={`${starNum}/10`}
            >
              <Star
                className={`${starSizes[size]} transition-colors duration-150 ${
                  filled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-zinc-700 hover:text-zinc-400'
                }`}
              />
            </button>
          );
        })}

        <span className="ml-3 font-extrabold text-xl text-amber-400 min-w-[65px] tracking-tight">
          {displayVal !== null ? `${displayVal.toFixed(1)}/10` : '—/10'}
        </span>
      </div>

      {/* Direct Fine-Tune Number Slider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-zinc-500 font-bold">0.0</span>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={value ?? 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
        />
        <span className="text-[10px] text-zinc-500 font-bold">10.0</span>
        {value !== null && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer px-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      {showPresets && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {PRESETS.map((p) => (
            <button
              key={p.val}
              type="button"
              onClick={() => onChange(p.val)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                value === p.val
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-zinc-950/80 border-white/5 text-zinc-400 ' + p.color
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
