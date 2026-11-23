import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingWidgetProps {
  value: number | null;
  onChange: (val: number | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingWidget: React.FC<RatingWidgetProps> = ({ value, onChange, size = 'md' }) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const displayVal = hoverVal !== null ? hoverVal : value;

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNum) => {
          const filled = displayVal !== null && displayVal >= starNum;
          const half = displayVal !== null && displayVal >= starNum - 0.5 && displayVal < starNum;

          return (
            <button
              key={starNum}
              type="button"
              className="p-1 transition-transform hover:scale-125 focus:outline-none"
              onMouseEnter={() => setHoverVal(starNum)}
              onMouseLeave={() => setHoverVal(null)}
              onClick={() => onChange(value === starNum ? null : starNum)}
              title={`${starNum}/10`}
            >
              <Star
                className={`${starSizes[size]} transition-colors duration-200 ${
                  filled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              />
            </button>
          );
        })}

        <span className="ml-3 font-bold text-lg text-amber-400 min-w-[55px]">
          {displayVal !== null ? `${displayVal.toFixed(1)}/10` : '—/10'}
        </span>
      </div>

      {/* Direct Fine-Tune Number Slider */}
      <div className="flex items-center gap-3 mt-1">
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={value ?? 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
        />
        {value !== null && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
