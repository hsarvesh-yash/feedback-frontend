import React from 'react';
import { Users, Star, ThumbsUp } from 'lucide-react';
import type { FeedbackData } from '../../api';

interface KPICardsProps {
    data: FeedbackData[];
}

export function KPICards({ data }: KPICardsProps) {
    const totalResponses = data.length;
    const avgRating = totalResponses > 0
        ? (data.reduce((acc, curr) => acc + curr.rating, 0) / totalResponses).toFixed(1)
        : '0';

    // Promoters = 4 or 5 stars
    const promotersCount = data.filter(d => d.rating >= 4).length;
    const promotersPercent = totalResponses > 0
        ? Math.round((promotersCount / totalResponses) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Responses</p>
                    <h3 className="text-2xl font-bold text-slate-800">{totalResponses.toLocaleString()}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                    <Star size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Average Rating</p>
                    <h3 className="text-2xl font-bold text-slate-800">{avgRating} <span className="text-sm text-slate-400 font-normal">/ 5.0</span></h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <ThumbsUp size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Promoters (4-5 Stars)</p>
                    <h3 className="text-2xl font-bold text-slate-800">{promotersPercent}%</h3>
                </div>
            </div>

        </div>
    );
}
