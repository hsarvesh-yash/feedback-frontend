import React, { useState } from 'react';
import type { FeedbackData } from '../../api';

interface FeedbackTableProps {
    data: FeedbackData[];
}

export function FeedbackTable({ data }: FeedbackTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Recent Verbatim Feedback</h3>
                <span className="text-sm text-slate-500">{data.length} total entries</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <th className="p-4 font-medium">Rating</th>
                            <th className="p-4 font-medium">Primary Feedback</th>
                            <th className="p-4 font-medium">Secondary Feedback</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Consent Details</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {currentData.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${item.rating >= 4 ? 'bg-green-100 text-green-800' :
                                            item.rating === 3 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {item.rating} Star{item.rating !== 1 && 's'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-800 max-w-xs truncate" title={item.feedback_primary}>
                                    {item.feedback_primary}
                                </td>
                                <td className="p-4 text-slate-600 max-w-xs truncate" title={item.feedback_secondary || '-'}>
                                    {item.feedback_secondary || '-'}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {item.service_category || 'General'}
                                </td>
                                <td className="p-4 text-slate-600 text-xs">
                                    {item.consent_to_publish ? (
                                        <div>
                                            <span className="text-green-600 font-semibold block">Yes</span>
                                            {item.display_name && <span className="block">{item.display_name}</span>}
                                            {item.organization && <span className="block text-slate-400">{item.organization}</span>}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">No</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {currentData.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    No feedback data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-medium">{data.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 text-slate-700 hover:bg-slate-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 text-slate-700 hover:bg-slate-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
