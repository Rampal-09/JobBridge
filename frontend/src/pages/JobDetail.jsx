import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getJobById,
  getJobApplications,
  updateApplicationStatus,
} from "../api/job";
import { useAuth } from "../context/Context";

const JobDetail = ({
  favoriteJobIds,
  applyJobIds,
  onFavorite,
  onEditing,
  onDeleteJob,
  handleApply,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Recruiter applications list state
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState("");

  const userId = user?.id || user?._id;
  const isOwner =
    user?.role === "recruiter" &&
    (job?.postedBy === userId || job?.postedBy?._id === userId);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id);
        setJob(res?.job || null);
      } catch (err) {
        console.log(err);
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (job && isOwner) {
      const fetchApps = async () => {
        try {
          setAppsLoading(true);
          const res = await getJobApplications(job._id);
          setApplications(res?.data || []);
        } catch (err) {
          console.log(err);
          setAppsError("Unable to load job applications.");
        } finally {
          setAppsLoading(false);
        }
      };
      fetchApps();
    }
  }, [job, isOwner]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (err) {
      console.log(err);
      alert(err.message || "Failed to update candidate status.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600 text-center text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center text-slate-500">
        Job not found.
      </div>
    );
  }

  const isFavorite = favoriteJobIds.includes(job._id);
  const isApplied = applyJobIds.includes(job._id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-semibold shadow-sm transition-all cursor-pointer"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Jobs
      </button>

      {/* Main Detail Card */}
      <div className="rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-sm space-y-6">
        {/* Title, Status & Tags */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
                {job.title}
              </h1>
              <p className="text-sm font-semibold text-slate-400 mt-1 capitalize">
                Posted by {isOwner ? "You" : "Recruiter"}
              </p>
            </div>
            <span
              className={`self-start inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                job.status === "open"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {job.status}
            </span>
          </div>

          {/* Job Metadata Tags */}
          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 py-2 font-medium text-slate-600 border border-slate-100">
              <svg
                className="h-4 w-4"
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
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-green-50/60 px-3.5 py-2 font-semibold text-green-700 border border-green-100/50">
              <svg
                className="h-4 w-4"
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
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50/60 px-3.5 py-2 font-medium text-indigo-700 border border-indigo-100/50 capitalize">
              {job.jobType}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50/60 px-3.5 py-2 font-medium text-violet-700 border border-violet-100/50 capitalize">
              {job.experienceLevel} Level
            </span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Requirements & Description */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">
              Skills Required
            </h3>
            {job?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No specific skills listed.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">
              Job Description
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 text-xs md:text-sm text-slate-600 border border-slate-100/50">
            <span>
              Total Openings:{" "}
              <strong className="text-slate-900">{job.jobOpening}</strong>
            </span>
            <span>
              Posted:{" "}
              <strong className="text-slate-900">
                {new Date(job.createdAt).toLocaleDateString()}
              </strong>
            </span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {user?.role === "candidate" && (
            <>
              <button
                onClick={() => handleApply(job)}
                disabled={isApplied}
                className="flex-1 py-3 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 outline-none cursor-pointer text-center"
              >
                {isApplied ? "Applied to Position" : "Apply for Job"}
              </button>

              <button
                onClick={() => onFavorite(job._id)}
                disabled={isFavorite}
                className={`py-3 px-5 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isFavorite
                    ? "bg-rose-50 border-rose-100 text-rose-500"
                    : "border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50/40 hover:border-rose-100"
                }`}
              >
                <svg
                  className="h-5 w-5 animate-pulse-slow"
                  fill={isFavorite ? "currentColor" : "none"}
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
                {isFavorite ? "Saved" : "Save Job"}
              </button>
            </>
          )}

          {isOwner && (
            <>
              <button
                onClick={() => onEditing(job)}
                className="flex-1 py-3 text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm outline-none cursor-pointer"
              >
                Edit Job Details
              </button>

              <button
                onClick={() => {
                  onDeleteJob(job._id);
                  navigate("/");
                }}
                className="flex-1 py-3 text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm outline-none cursor-pointer"
              >
                Delete Listing
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recruiter Applications Widget */}
      {isOwner && (
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">
              Job Applications
            </h3>
            <p className="text-sm text-slate-500">
              Manage candidates who applied for this position and update their
              status.
            </p>
          </div>

          <hr className="border-slate-100" />

          {appsLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-xs font-semibold text-slate-400">
                  Loading applicants...
                </p>
              </div>
            </div>
          ) : appsError ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-600 text-center font-medium">
              {appsError}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3 border border-slate-100">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-700">
                No applications yet
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                As soon as candidates apply, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const candidate = app.candidateId;
                if (!candidate) return null;
                return (
                  <div
                    key={app._id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Candidate Identity */}
                    <div className="flex items-center gap-4.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-base shadow-sm border border-indigo-100/30">
                        {candidate.name ? candidate.name[0].toUpperCase() : "?"}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-sm md:text-base">
                          {candidate.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {candidate.email}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Status Dropdown */}
                    <div className="flex flex-wrap items-center gap-3 md:self-center">
                      {app.resumeUrl && (
                        <a
                          href={
                            app.resumeUrl.includes("/raw/upload/")
                              ? `https://docs.google.com/gview?url=${encodeURIComponent(app.resumeUrl)}&embedded=true`
                              : app.resumeUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                        >
                          <svg
                            className="h-4 w-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Resume
                        </a>
                      )}

                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors cursor-pointer text-slate-700"
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interviewing</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;
