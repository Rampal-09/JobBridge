import "./App.css";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {
  getFavorite,
  getJobs,
  updateJob,
  deleteJob,
  favorite,
  apply,
  getAppliedJob,
} from "./api/job";
import ProtectedRoute from "./pages/ProtectedRoute";

const SignUp = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const JobList = lazy(() => import("./pages/JobList"));
const CreateJob = lazy(() => import("./pages/CreateJob"));
const ProfileModal = lazy(() => import("./pages/ProfileModal"));
const ProfileDetail = lazy(() => import("./pages/ProfileDetail"));
const FavoriteJobList = lazy(() => import("./pages/FavoriteJobList"));
const AppliedJobList = lazy(() => import("./pages/AppliedJobList"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const ApplyModal = lazy(() => import("./pages/ApplyModal"));
const EditJob = lazy(() => import("./pages/EditJob"));
import Filter from "./pages/Filter";
import HeroBanner from "./component/HeroBanner";
import { useAuth } from "./context/Context";

function App() {
  const { user } = useAuth();
  const [favoriteJobIds, setFavoriteJobIds] = useState([]);
  const [favoriteJob, setFavoriteJob] = useState([]);
  const [applyJobList, setApplyJobList] = useState([]);
  const [applyJobIds, setApplyJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isApply, setIsApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    status: "",
    experienceLevel: "",
    minSalary: 0,
  });
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const res = await getJobs({ ...filters, page, limit: 6 });
        setJobs(res.jobs || []);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [filters, page]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      status: "",
      experienceLevel: "",
      minSalary: 0,
    });
    setPage(1);
  };

  const onEditing = (job) => {
    setEditing(true);
    setEditingJob(job);
  };

  const onUpdate = async (job, jobId) => {
    try {
      const res = await updateJob(job, jobId);

      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j._id === res.job._id
            ? {
                ...j,
                title: res.job.title,
                location: res.job.location,
                salary: res.job.salary,
                jobType: res.job.jobType,
                experienceLevel: res.job.experienceLevel,
                skills: res.job.skills,
                jobOpening: res.job.jobOpening,
                description: res.job.description,
              }
            : j,
        ),
      );
      setEditing(false);
      setEditingJob(null);
    } catch (err) {
      console.log("update Error", err);
    }
  };

  const onCancel = () => {
    setEditing(false);
    setEditingJob(null);
  };

  const onDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs((prevJobs) => prevJobs.filter((j) => j._id !== jobId));
    } catch (err) {
      console.log(err);
    }
  };

  const onFavorite = async (jobId) => {
    try {
      const isAlreadyFav = favoriteJobIds.includes(jobId);
      await favorite(jobId);
      
      if (isAlreadyFav) {
        setFavoriteJobIds((prevIds) => prevIds.filter((id) => id !== jobId));
        setFavoriteJob((prevList) =>
          prevList.filter(
            (item) => item.favorite?._id !== jobId && item.favorite !== jobId,
          ),
        );
      } else {
        setFavoriteJobIds((prevIds) => [...prevIds, jobId]);
        const res = await getFavorite();
        setFavoriteJob(res.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) {
      setFavoriteJob([]);
      setFavoriteJobIds([]);
      return;
    }
    getFavorite()
      .then((res) => {
        const favorites = res.data || [];
        setFavoriteJob(favorites);
        setFavoriteJobIds(
          favorites.map((item) => item.favorite?._id).filter(Boolean),
        );
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, [user]);

  useEffect(() => {
    if (!user) {
      setApplyJobList([]);
      setApplyJobIds([]);
      return;
    }
    const fetchAppliedJobs = async () => {
      try {
        const res = await getAppliedJob();
        const applied = res?.data || [];
        setApplyJobList(applied);
        setApplyJobIds(applied.map((item) => item.jobId?._id).filter(Boolean));
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchAppliedJobs();
  }, [user]);

  const handleApply = (job) => {
    setIsApply(true);
    setSelectedJob(job);
  };

  const onApply = async (jobId) => {
    try {
      await apply(jobId);
      setApplyJobIds((prevIds) =>
        prevIds.includes(jobId) ? prevIds : [...prevIds, jobId],
      );
      setApplyJobList((prevList) =>
        prevList.some((item) => item.jobId?._id === jobId)
          ? prevList
          : [...prevList, { _id: jobId, jobId: { _id: jobId } }],
      );
      setIsApply(false);
      setSelectedJob(null);
    } catch (err) {
      console.log("apply err", err);
      if (err.message === "profile not found") {
        alert("Profile not found. Please create your profile and upload a resume before applying.");
      } else {
        alert(err.message || "Failed to submit application. Please try again.");
      }
    }
  };

  const activeFilterCount = [
    filters.location,
    filters.type,
    filters.status,
    filters.experienceLevel,
    filters.minSalary > 0 ? filters.minSalary : "",
  ].filter(Boolean).length;

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/signUp" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>

          {/* Recruiter Only - Create Job */}
          <Route
            path="/create-job"
            element={
              <ProtectedRoute allowRole="recruiter">
                <CreateJob />
              </ProtectedRoute>
            }
          ></Route>

          {/* Protected - All Authenticated Users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileModal />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/profile/detail"
            element={
              <ProtectedRoute>
                <ProfileDetail />
              </ProtectedRoute>
            }
          ></Route>

          {/* Candidate Only - Favorites & Applied */}
          <Route
            path="/favorite"
            element={
              <ProtectedRoute allowRole="candidate">
                <FavoriteJobList
                  favoriteJob={favoriteJob}
                  onDeleteJob={onDeleteJob}
                  onEditing={onEditing}
                  onFavorite={onFavorite}
                  handleApply={handleApply}
                  favoriteJobIds={favoriteJobIds}
                  applyJobIds={applyJobIds}
                />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/applied"
            element={
              <ProtectedRoute allowRole="candidate">
                <AppliedJobList
                  applyJobList={applyJobList}
                  favoriteJobIds={favoriteJobIds}
                  applyJobIds={applyJobIds}
                  handleApply={handleApply}
                  onFavorite={onFavorite}
                />
              </ProtectedRoute>
            }
          ></Route>

          {/* Protected - All Authenticated Users - Home & Job Details */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="space-y-8 relative">
                  {/* Full Width Hero Banner at the top */}
                  <HeroBanner
                    searchVal={filters.search}
                    onSearchChange={(val) => handleFilterChange("search", val)}
                    user={user}
                  />

                  {/* Filter and Jobs list grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
                      <Filter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={resetFilters}
                      />
                    </div>
                    <div className="col-span-1 lg:col-span-3 space-y-6">
                      {/* Mobile Inline Filter Trigger Bar */}
                      <div className="lg:hidden flex items-center justify-between bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm animate-slide-down">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 font-display">Job Directory</span>
                          <span className="text-xs text-slate-400 mt-0.5">
                            {jobs.length > 0 ? `${jobs.length} matching jobs found` : "Find your role"}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsFilterOpen(true)}
                          className="bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-bold px-4 py-2.5 rounded-xl border border-indigo-100/50 flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-95"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          <span className="text-xs font-bold">Filters</span>
                          {activeFilterCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-extrabold text-white animate-scale-up">
                              {activeFilterCount}
                            </span>
                          )}
                        </button>
                      </div>

                      <JobList
                        favoriteJobIds={favoriteJobIds}
                        jobs={jobs}
                        isLoading={isLoadingJobs}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={resetFilters}
                        onEditing={onEditing}
                        onDeleteJob={onDeleteJob}
                        onFavorite={onFavorite}
                        handleApply={handleApply}
                        applyJobIds={applyJobIds}
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                    </div>
                  </div>

                  {/* Slide-over Bottom Sheet for Mobile Filters */}
                  {isFilterOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-0 animate-modal-backdrop">
                      <div className="w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 flex flex-col animate-modal-content">
                        {/* Header bar of drawer */}
                        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
                          <span className="text-base font-bold text-slate-800 font-display">Filters</span>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <svg className="h-5.5 w-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Filter Content scroll area */}
                        <div className="flex-1 overflow-y-auto">
                          <Filter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onResetFilters={resetFilters}
                          />
                        </div>

                        {/* Drawer footer sticky action */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-98 cursor-pointer text-sm"
                          >
                            Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetail
                  favoriteJobIds={favoriteJobIds}
                  applyJobIds={applyJobIds}
                  onFavorite={onFavorite}
                  onEditing={onEditing}
                  onDeleteJob={onDeleteJob}
                  handleApply={handleApply}
                />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Global Apply Modal Dialog */}
        {isApply && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-modal-backdrop">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 animate-modal-content">
              <ApplyModal
                selectedJob={selectedJob}
                onApply={onApply}
                onCancel={() => {
                  setIsApply(false);
                  setSelectedJob(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Global Edit Job Dialog */}
        {editing && editingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto animate-modal-backdrop">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto my-8 animate-modal-content">
              <EditJob
                job={editingJob}
                onCancel={onCancel}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        )}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
