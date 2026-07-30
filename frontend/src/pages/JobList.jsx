import JobCard from "./JobCard";

const JobList = ({
  favoriteJobIds,
  jobs,
  onEditing,
  onFavorite,
  onDeleteJob,
  handleApply,
  applyJobIds,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Grid List */}
      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No jobs found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((j) => (
              <JobCard
                key={j._id}
                job={j}
                onEditing={onEditing}
                onDeleteJob={onDeleteJob}
                onFavorite={onFavorite}
                isFavorite={favoriteJobIds.includes(j._id)}
                handleApply={handleApply}
                isApplied={applyJobIds.includes(j._id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-500">
                Showing Page <span className="text-slate-800 font-semibold">{currentPage}</span> of{" "}
                <span className="text-slate-800 font-semibold">{totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5">
                {/* Prev Button */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                  Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`h-9 w-9 inline-flex items-center justify-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
