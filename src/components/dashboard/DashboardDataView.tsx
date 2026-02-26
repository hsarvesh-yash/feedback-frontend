import React, { useEffect, useState } from 'react';
import { KPICards } from './KPICards';
import { RatingCharts } from './RatingCharts';
import { FeedbackTable } from './FeedbackTable';
import type { FeedbackData } from '../../api';
import { getAllFeedback } from '../../api';

export function DashboardDataView() {
    const [data, setData] = useState<FeedbackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchFeedback = async () => {
        setLoading(true);
        setError('');
        try {
            const jsonData = await getAllFeedback();
            setData(jsonData);
            setLastUpdated(new Date().toLocaleString());
        } catch (err: any) {
            console.error('Failed to load feedback:', err);
            setError(err.message || 'Error reading local database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading metrics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 shadow-sm max-w-lg">
                    <h2 className="text-lg font-bold mb-2">Failed to load dashboard</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Feedback Analytics</h1>
                        <p className="text-slate-500">Real-time insights from your service users.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                            Live Database Connected
                        </div>
                        <div className="text-sm text-slate-500">{lastUpdated ? `Last updated: ${lastUpdated}` : ''}</div>
                        <button
                            onClick={() => fetchFeedback()}
                            className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100"
                        >
                            Refresh
                        </button>
                    </div>
                </header>

                <KPICards data={data} />
                <RatingCharts data={data} />
                <FeedbackTable data={data} />
            </div>
        </div>
    );
}
