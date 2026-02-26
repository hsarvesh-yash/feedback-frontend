import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import type { FeedbackData } from '../../api';

interface RatingChartsProps {
    data?: FeedbackData[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

export function RatingCharts({ data }: RatingChartsProps) {

    const ratingDistribution = useMemo(() => {
        const dist = [
            { name: '1 Star', count: 0 },
            { name: '2 Stars', count: 0 },
            { name: '3 Stars', count: 0 },
            { name: '4 Stars', count: 0 },
            { name: '5 Stars', count: 0 },
        ];
        (data || []).forEach(fb => {
            if (fb && fb.rating >= 1 && fb.rating <= 5) {
                dist[fb.rating - 1].count += 1;
            }
        });
        return dist;
    }, [data]);

    const categoryDistribution = useMemo(() => {
        const cats: Record<string, number> = {};
        (data || []).forEach(fb => {
            const cat = (fb && fb.service_category) || 'Uncategorized';
            cats[cat] = (cats[cat] || 0) + 1;
        });
        return Object.keys(cats).map(key => ({ name: key, value: cats[key] }));
    }, [data]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart for Ratings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Rating Distribution</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ratingDistribution} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {ratingDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart for Categories */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Feedback by Category</h3>
                <div className="h-[300px] w-full">
                    {categoryDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">No category data</div>
                    )}
                </div>
            </div>
        </div>
    );
}
