import React from 'react';

interface ConsentSectionProps {
    consent: boolean;
    onConsentChange: (val: boolean) => void;
    displayName: string;
    onDisplayNameChange: (val: string) => void;
    organization: string;
    onOrganizationChange: (val: string) => void;
}

export function ConsentSection({
    consent,
    onConsentChange,
    displayName,
    onDisplayNameChange,
    organization,
    onOrganizationChange
}: ConsentSectionProps) {
    return (
        <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-100 animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">
                Thank you for the 5-star rating! ✨
            </h3>

            <div className="flex items-start gap-3 mb-6">
                <div className="flex items-center h-6">
                    <input
                        id="consent-checkbox"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => onConsentChange(e.target.checked)}
                        className="w-5 h-5 text-primary-600 bg-white border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                </div>
                <label htmlFor="consent-checkbox" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                    I agree that my feedback can be used publicly (website, marketing, etc.) after an internal review.
                </label>
            </div>

            {consent && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                    <p className="text-xs text-slate-500 mb-2">
                        If you'd like to be credited, please provide your details below. These are completely optional.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Name or display name (optional)
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => onDisplayNameChange(e.target.value)}
                                placeholder="Jane Doe"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Organization / Role (optional)
                            </label>
                            <input
                                type="text"
                                value={organization}
                                onChange={(e) => onOrganizationChange(e.target.value)}
                                placeholder="CEO at TechCorp"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
