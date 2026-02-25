const API_BASE_URL = 'https://feedback-backend-baaffravb8apeeeh.centralindia-01.azurewebsites.net/api/feedback';

export interface FeedbackData {
    rating: number;
    feedback_primary: string;
    feedback_secondary?: string;
    consent_to_publish?: boolean;
    display_name?: string;
    organization?: string;
    service_category?: string;
}

export const submitFeedback = async (data: FeedbackData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
    }

    return response.json();
};
