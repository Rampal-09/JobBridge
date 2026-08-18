import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Context";

const JobCard = ({
  job,
  onEditing,
  onDeleteJob,
  onFavorite,
  isFavorite,
  handleApply,
  isApplied,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Show recruiter actions only if the logged in user is a recruiter and owns the job
  const userId = user?.id || user?._id;
  const isOwner =
    user?.role === "recruiter" &&
    (job.postedBy === userId || job.postedBy?._id === userId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (onFavorite) onFavorite(job._id);
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (handleApply) handleApply(job);
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100/90 transition-all duration-300">
      {/* Top row: Status / Brand tag + Favorite Heart Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              job.status === "open"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                job.status === "open" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            ></span>
            {job.status || "open"}
          </span>

          {job.jobOpening > 0 && (
            <span className="text-[11px] font-medium text-slate-400">
              {job.jobOpening} {job.jobOpening === 1 ? "opening" : "openings"}
            </span>
          )}
        </div>

        {/* Favorite Heart (Visible to candidates and guests) */}
        {(!user || user.role === "candidate") && (
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full border transition-all duration-200 outline-none cursor-pointer ${
              isFavorite
                ? "bg-rose-50 border-rose-100 text-rose-500 scale-105"
                : "bg-slate-50 border-slate-200/70 text-slate-400 hover:text-rose-500 hover:bg-rose-50/40 hover:border-rose-100 hover:scale-105"
            }`}
            title={isFavorite ? "Remove from Saved" : "Save to Favorites"}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${
                isFavorite ? "fill-rose-500 stroke-rose-500" : "fill-transparent stroke-current"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {/* Job Title */}
        <div>
          <Link
            to={`/jobs/${job._id}`}
            className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-1"
          >
            {job.title}
          </Link>
        </div>

        {/* Job Metadata Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Location */}
          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-2.5 py-1 font-medium text-slate-600 border border-slate-100">
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>

          {/* Job Type */}
          <span className="inline-flex items-center rounded-xl bg-indigo-50/70 px-2.5 py-1 font-medium text-indigo-700 border border-indigo-100/50 capitalize">
            {job.jobType}
          </span>

          {/* Experience */}
          <span className="inline-flex items-center rounded-xl bg-violet-50/70 px-2.5 py-1 font-medium text-violet-700 border border-violet-100/50 capitalize">
            {job.experienceLevel}
          </span>

          {/* Salary */}
          {job.salary > 0 && (
            <span className="inline-flex items-center rounded-xl bg-emerald-50/70 px-2.5 py-1 font-bold text-emerald-700 border border-emerald-100/60">
              ${Number(job.salary).toLocaleString()}/yr
            </span>
          )}
        </div>

        {/* Description Snippet */}
        <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Cloud */}
        {job?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/60"
              >
                {s}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="rounded-lg bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-200/50">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-4 mt-5 border-t border-slate-100">
        {(!user || user?.role === "candidate") && (
          <button
            onClick={handleApplyClick}
            disabled={isApplied}
            className="flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xs hover:shadow-md hover:shadow-indigo-100 outline-none cursor-pointer"
          >
            {isApplied ? "Applied" : "Apply Now"}
          </button>
        )}

        <Link
          to={`/jobs/${job._id}`}
          className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 ${
            user?.role === "recruiter" ? "flex-1" : ""
          }`}
        >
          Details
        </Link>

        {isOwner && (
          <div className="flex gap-1.5">
            <button
              onClick={() => onEditing && onEditing(job)}
              className="py-2 px-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteJob && onDeleteJob(job._id)}
              className="py-2 px-2.5 text-xs font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
