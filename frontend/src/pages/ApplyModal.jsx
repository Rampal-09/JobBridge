import React from "react";

const ApplyModal = ({ selectedJob, onApply, onCancel }) => {
  const handleApply = (e) => {
    e.preventDefault();
    onApply(selectedJob._id);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Modal Header */}
      <div className="space-y-1.5 text-center md:text-left">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          Confirm Your Application
        </h2>
        <p className="text-sm text-slate-500">
          You are applying for <strong className="text-slate-800">{selectedJob.title}</strong> in <span className="text-slate-600 font-medium">{selectedJob.location}</span>.
        </p>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-5 space-y-3 text-sm text-indigo-950">
        <p className="font-semibold text-indigo-900 flex items-center gap-1.5">
          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Profile Resume Submission
        </p>
        <p className="text-indigo-800/90 leading-relaxed text-xs">
          JobBridge will submit the resume and profile details already saved in your candidate profile. Please ensure your profile is up-to-date before submitting.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors outline-none cursor-pointer text-center"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 py-3 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 outline-none cursor-pointer text-center"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ApplyModal;
