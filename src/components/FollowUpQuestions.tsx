import React from 'react';

interface FollowUpQuestionsProps {
    rating: number;
    primaryFeedback: string;
    secondaryFeedback: string;
    onPrimaryChange: (val: string) => void;
    onSecondaryChange: (val: string) => void;
}

export function FollowUpQuestions({
    rating,
    primaryFeedback,
    secondaryFeedback,
    onPrimaryChange,
    onSecondaryChange
}: FollowUpQuestionsProps) {

    if (rating === 0) return null;

    // Branching text logic based on rating
    let primaryLabel = '';
    let secondaryLabel = '';

    if (rating === 1 || rating === 2) {
        primaryLabel = "What went wrong or did not meet your expectations?";
        secondaryLabel = "What could we have done better?";
    } else if (rating === 3) {
        primaryLabel = "What stopped you from rating us higher?";
        secondaryLabel = "What is one thing we could improve?";
    } else if (rating === 4) {
        primaryLabel = "What did you like the most?";
        secondaryLabel = "What could we improve to make this a 5 next time?";
    } else if (rating === 5) {
        primaryLabel = "What did you like the most about our service?";
        secondaryLabel = "Would you recommend us to others? Why?";
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {primaryLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={primaryFeedback}
                    onChange={(e) => onPrimaryChange(e.target.value)}
                    className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y min-h-[100px] text-slate-800 transition-colors"
                    placeholder="Please share your detailed thoughts..."
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {secondaryLabel}
                </label>
                <textarea
                    value={secondaryFeedback}
                    onChange={(e) => onSecondaryChange(e.target.value)}
                    className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y min-h-[100px] text-slate-800 transition-colors"
                    placeholder="Optional: Any additional context..."
                />
            </div>
        </div>
    );
}
