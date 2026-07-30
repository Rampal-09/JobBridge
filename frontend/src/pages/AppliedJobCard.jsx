import { Link } from "react-router-dom";
import { useAuth } from "../context/Context";

const AppliedJobCard = ({
  a,
  isApplied,
  isFavorite,
  handleApply,
  onFavorite,
}) => {
  const { user } = useAuth();
  const job = a.jobId;

  // Render placeholder if the job has been deleted by recruiter
  if (!job) {
    return (
      <div className="flex flex-col justify-between bg-slate-50/50 rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-400">Position Unavailable</h3>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200">
              Closed
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            The job listing associated with this application has been removed or deleted by the recruiter.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">
            Status: {a.status}
          </span>
        </div>
      </div>
    );
  }

  // Color mapping for application statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "interview":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "shortlisted":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
    }
  };

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
        {/* Header Title & Application Status */}
        <div className="flex flex-col gap-2 pr-10">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {job.title}
          </h2>
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusColor(
                a.status,
              )}`}
            >
              {a.status}
            </span>
          </div>
        </div>

        {/* Job Metadata tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-50 px-2.5 py-1 font-medium text-slate-600 border border-slate-100">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-green-50/60 px-2.5 py-1 font-semibold text-green-700 border border-green-100/50">
            ${Number(job.salary).toLocaleString()}/yr
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-indigo-50/60 px-2.5 py-1 font-medium text-indigo-700 border border-indigo-100/50 capitalize">
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl bg-violet-50/60 px-2.5 py-1 font-medium text-violet-700 border border-violet-100/50 capitalize">
            {job.experienceLevel}
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Cloud */}
        {job?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
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
        <button
          onClick={() => handleApply(job)}
          disabled={isApplied}
          className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-colors shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 outline-none cursor-pointer"
        >
          {isApplied ? "Applied" : "Re-apply"}
        </button>

        <Link
          to={`/jobs/${job._id}`}
          className="py-2.5 px-4 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default AppliedJobCard;
