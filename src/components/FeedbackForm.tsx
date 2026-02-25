import React, { useState } from 'react';
import { submitFeedback, type FeedbackData } from '../api';
import { RatingSelector } from './RatingSelector';
import { FollowUpQuestions } from './FollowUpQuestions';
import { ConsentSection } from './ConsentSection';
import { SocialSharePrompt } from './SocialSharePrompt';

export function FeedbackForm() {
    const [rating, setRating] = useState<number>(0);
    const [primaryFeedback, setPrimaryFeedback] = useState('');
    const [secondaryFeedback, setSecondaryFeedback] = useState('');
    const [consent, setConsent] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [organization, setOrganization] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        // Reset inputs when rating changes
        setPrimaryFeedback('');
        setSecondaryFeedback('');
        setConsent(false);
        setDisplayName('');
        setOrganization('');
    };

    const isFormValid = () => {
        if (rating === 0) return false;
        if (!primaryFeedback.trim()) return false;
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setError('');
        setIsSubmitting(true);

        try {
            const payload: FeedbackData = {
                rating,
                feedback_primary: primaryFeedback,
                feedback_secondary: secondaryFeedback,
                consent_to_publish: rating === 5 ? consent : false,
                display_name: rating === 5 && consent ? displayName : undefined,
                organization: rating === 5 && consent ? organization : undefined,
                service_category: 'IT Support', // Hardcoded typical use case or passed via props
            };

            await submitFeedback(payload);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred while submitting feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess && rating === 5) {
        return <SocialSharePrompt feedbackText={primaryFeedback} />;
    }

    if (isSuccess) {
        return (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h2>
                <p className="text-slate-600">Your feedback has been successfully submitted and helps us improve.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
            <RatingSelector rating={rating} onRatingChange={handleRatingChange} />

            {rating > 0 && (
                <div className="animate-in fade-in duration-300">
                    <FollowUpQuestions
                        rating={rating}
                        primaryFeedback={primaryFeedback}
                        secondaryFeedback={secondaryFeedback}
                        onPrimaryChange={setPrimaryFeedback}
                        onSecondaryChange={setSecondaryFeedback}
                    />
                </div>
            )}

            {rating === 5 && (
                <ConsentSection
                    consent={consent}
                    onConsentChange={setConsent}
                    displayName={displayName}
                    onDisplayNameChange={setDisplayName}
                    organization={organization}
                    onOrganizationChange={setOrganization}
                />
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}

            {rating > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <button
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
                        className={`
              w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all
              ${isFormValid() && !isSubmitting
                                ? 'bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                                : 'bg-slate-300 cursor-not-allowed'}
            `}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2 justify-center">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Feedback'
                        )}
                    </button>
                </div>
            )}
        </form>
    );
}
