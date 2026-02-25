import React from 'react';
import { Linkedin, Globe, MessageCircle } from 'lucide-react'; // Approximating some icons

interface SocialSharePromptProps {
    feedbackText: string;
}

export function SocialSharePrompt({ feedbackText }: SocialSharePromptProps) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(feedbackText);
            alert('Feedback copied to clipboard! You can now paste it into your favorite review site.');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-block bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Feedback Submitted!</h2>
                <p className="text-slate-600 mb-6">
                    Thank you so much for your glowing review. Your support means the world to us.
                </p>

                <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left border border-slate-200">
                    <p className="text-sm text-slate-700 italic">"{feedbackText}"</p>
                    <button
                        onClick={copyToClipboard}
                        className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy Review Text
                    </button>
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-800 mb-3">
                        Would you mind sharing your experience publicly? It takes just 30 seconds!
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-center">
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
                        >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                        </a>
                        <a
                            href="https://google.com/business"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Globe className="w-4 h-4 text-red-500" />
                            <span>Google</span>
                        </a>
                        <a
                            href="https://g2.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors col-span-2 sm:col-span-1"
                        >
                            <MessageCircle className="w-4 h-4 text-orange-400" />
                            <span>G2 / Clutch</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
