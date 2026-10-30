import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 text-center">
                
                {/* Error Icon / Illustration */}
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-indigo-100">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Status Code */}
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 mb-3">
                    Error 404
                </span>

                {/* Heading & Description */}
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Page not found
                </h1>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or never existed.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/attendance')}
                        className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NotFound;