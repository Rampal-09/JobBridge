import AppliedJobCard from "./AppliedJobCard";

const AppliedJobList = ({
  applyJobList,
  favoriteJobIds,
  applyJobIds,
  handleApply,
  onFavorite,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="py-6 md:py-8 text-center md:text-left space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
          Your{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Applied Jobs
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
          Keep track of your job applications and their current recruitment status.
        </p>
      </div>

      {/* Grid List */}
      {applyJobList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 animate-bounce">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No applications yet</h3>
          <p className="text-slate-400 text-sm mt-1">Start browsing jobs and apply for roles that match your career goals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applyJobList.map((A) => (
            <AppliedJobCard
              key={A._id}
              a={A}
              isFavorite={favoriteJobIds.includes(A.jobId?._id)}
              isApplied={applyJobIds.includes(A.jobId?._id)}
              handleApply={handleApply}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobList;
