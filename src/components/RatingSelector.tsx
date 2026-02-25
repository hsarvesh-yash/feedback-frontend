import React from 'react';
import { Star } from 'lucide-react';

interface RatingSelectorProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

export function RatingSelector({ rating, onRatingChange }: RatingSelectorProps) {
    return (
        <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                How would you rate our IT & Support services?
            </h2>
            <div className="flex gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => onRatingChange(value)}
                        className={`
              btn-transition flex flex-col items-center p-3 sm:p-4 rounded-xl border border-slate-200
              hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-100
              ${rating === value ? 'border-primary-500 bg-primary-50 transform scale-105 shadow-md' : 'bg-white'}
            `}
                        aria-label={`Rate ${value} out of 5 stars`}
                    >
                        <Star
                            className={`w-8 h-8 sm:w-12 sm:h-12 mb-2 ${rating >= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                            strokeWidth={1.5}
                        />
                        <span className={`text-sm font-medium ${rating === value ? 'text-primary-700' : 'text-slate-500'}`}>
                            {value} {value === 1 ? 'Star' : 'Stars'}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
