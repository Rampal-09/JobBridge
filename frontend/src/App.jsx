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
import { useAuth } from "./context/Context";

const SignUp = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const BrowseJobs = lazy(() => import("./pages/BrowseJobs"));
const CreateJob = lazy(() => import("./pages/CreateJob"));
const ProfileModal = lazy(() => import("./pages/ProfileModal"));
const ProfileDetail = lazy(() => import("./pages/ProfileDetail"));
const FavoriteJobList = lazy(() => import("./pages/FavoriteJobList"));
const AppliedJobList = lazy(() => import("./pages/AppliedJobList"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const ApplyModal = lazy(() => import("./pages/ApplyModal"));
const EditJob = lazy(() => import("./pages/EditJob"));

function App() {
  const { user } = useAuth();
  const [favoriteJobIds, setFavoriteJobIds] = useState([]);
  const [favoriteJob, setFavoriteJob] = useState([]);
  const [applyJobList, setApplyJobList] = useState([]);
  const [applyJobIds, setApplyJobIds] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isApply, setIsApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const onEditing = (job) => {
    setEditing(true);
    setEditingJob(job);
  };

  const onUpdate = async (job, jobId) => {
    try {
      await updateJob(job, jobId);
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
        alert(
          "Profile not found. Please create your profile and upload a resume before applying.",
        );
      } else {
        alert(err.message || "Failed to submit application. Please try again.");
      }
    }
  };

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-slate-500">
                Loading JobBridge...
              </p>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/signUp" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>

          {/* Public & Authenticated Homepage */}
          <Route
            path="/"
            element={
              <Home
                favoriteJobIds={favoriteJobIds}
                applyJobIds={applyJobIds}
                onFavorite={onFavorite}
                handleApply={handleApply}
                onEditing={onEditing}
                onDeleteJob={onDeleteJob}
              />
            }
          ></Route>

          {/* Public & Authenticated Browse Jobs Directory */}
          <Route
            path="/jobs"
            element={
              <BrowseJobs
                favoriteJobIds={favoriteJobIds}
                applyJobIds={applyJobIds}
                onFavorite={onFavorite}
                handleApply={handleApply}
                onEditing={onEditing}
                onDeleteJob={onDeleteJob}
              />
            }
          ></Route>

          {/* Recruiter Only - Create Job */}
          <Route
            path="/create-job"
            element={
              <ProtectedRoute allowRole="recruiter">
                <CreateJob />
              </ProtectedRoute>
            }
          ></Route>

          {/* Protected - All Authenticated Users - Profile */}
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

          {/* Protected / General - Job Details */}
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

          <Route path="*" element={<Navigate to="/" replace />} />
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
