import { Link } from "react-router-dom";
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

  // Show recruiter actions only if the logged in user is a recruiter and owns the job
  const userId = user?.id || user?._id;
  const isOwner =
    user?.role === "recruiter" &&
    (job.postedBy === userId || job.postedBy?._id === userId);

  return (
    <div className="relative flex flex-col justify-between bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100/80 transition-all duration-300">
      {/* Floating Heart Button */}
      {user?.role === "candidate" && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite(job._id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-all duration-300 outline-none cursor-pointer z-10 ${
            isFavorite
              ? "bg-rose-50 border-rose-100 text-rose-500 scale-110"
              : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/40 hover:border-rose-100 hover:scale-110 shadow-sm"
          }`}
          title={isFavorite ? "Remove from Saved" : "Save to Favorites"}
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isFavorite ? "fill-rose-500 stroke-rose-500" : "fill-transparent stroke-current hover:scale-110"}`}
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

      <div className="space-y-4">
        {/* Header Title & Status */}
        <div className="flex flex-col gap-2 pr-10">
          <Link
            to={`/jobs/${job._id}`}
            className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-tight"
          >
            {job.title}
          </Link>
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                job.status === "open"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        {/* Job Metadata tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 font-medium text-slate-600 border border-slate-100">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-green-50/60 px-3 py-1.5 font-semibold text-green-700 border border-green-100/50">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ${Number(job.salary).toLocaleString()}/yr
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-indigo-50/60 px-3 py-1.5 font-medium text-indigo-700 border border-indigo-100/50 capitalize">
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-violet-50/60 px-3 py-1.5 font-medium text-violet-700 border border-violet-100/50 capitalize">
            {job.experienceLevel} Level
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Cloud */}
        {job?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {job.skills.map((s) => (
              <span
                key={s}
                className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500 border border-slate-100"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
        {user?.role === "candidate" && (
          <button
            onClick={() => handleApply(job)}
            disabled={isApplied}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-colors shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 outline-none cursor-pointer"
          >
            {isApplied ? "Applied" : "Apply Now"}
          </button>
        )}

        <Link
          to={`/jobs/${job._id}`}
          className={`py-2.5 px-4 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 ${
            user?.role === "recruiter" ? "flex-1" : ""
          }`}
        >
          Details
        </Link>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEditing(job)}
              className="py-2.5 px-4 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteJob(job._id)}
              className="py-2.5 px-4 text-sm font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50/30 transition-colors flex items-center justify-center cursor-pointer"
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
