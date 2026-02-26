import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FeedbackForm } from './components/FeedbackForm';
import { DashboardDataView } from './components/dashboard/DashboardDataView';

function PublicFormView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
          <div className="text-center mb-10 relative">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Help Us Improve
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Your insights matter. We constantly strive to provide the best IT & Support services possible.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 md:p-12 border border-slate-100">
          <FeedbackForm />
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          <p>
            Secured & Confidential. We value your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicFormView />} />
        <Route path="/dashboard" element={<DashboardDataView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
