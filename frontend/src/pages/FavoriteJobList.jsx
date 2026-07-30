import FavoriteJobCard from "./FavoriteJobCard";

const FavoriteJobList = ({
  favoriteJob,
  onDeleteJob,
  onEditing,
  onFavorite,
  handleApply,
  favoriteJobIds,
  applyJobIds,
}) => {
  const validFavorites = (favoriteJob || []).filter((f) => f?.favorite);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="py-6 md:py-8 text-center md:text-left space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
          Saved{" "}
          <span className="bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">
            Jobs
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
          Access all your bookmarked job listings and apply anytime.
        </p>
      </div>

      {/* Grid List */}
      {validFavorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4 animate-pulse">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No saved jobs</h3>
          <p className="text-slate-400 text-sm mt-1">Bookmark opportunities you are interested in to review and apply to them later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {validFavorites.map((f) => (
            <FavoriteJobCard
              key={f._id}
              f={f}
              onDeleteJob={onDeleteJob}
              onEditing={onEditing}
              onFavorite={onFavorite}
              handleApply={handleApply}
              isFavorite={favoriteJobIds.includes(f.favorite?._id)}
              isApplied={applyJobIds.includes(f.favorite?._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteJobList;
