import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyProfile,
  deleteProfileEducation,
  deleteProfileExperience,
} from "../api/job";
import { useAuth } from "../context/Context";

const formatDetailDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return dateStr.split("T")[0];
  }
};

const isImageValid = (url) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf") || lower.includes("/resumes/")) return false;
  return true;
};

const ProfileDetail = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeleteEducation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education item?"))
      return;
    try {
      await deleteProfileEducation(id);
      setProfile((prev) => ({
        ...prev,
        education: prev.education.filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.log("Delete education error", err);
      alert("Failed to delete education item: " + (err?.message || err));
    }
  };

  const handleDeleteExperience = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this experience item?")
    )
      return;
    try {
      await deleteProfileExperience(id);
      setProfile((prev) => ({
        ...prev,
        experience: prev.experience.filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.log("Delete experience error", err);
      alert("Failed to delete experience item: " + (err?.message || err));
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        setProfile(res?.data || null);
      } catch (err) {
        console.log("profile fetch error", err);
        setError("Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600 text-center text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center bg-white rounded-3xl border border-slate-200/60 p-8 space-y-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          No profile details found
        </h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          It looks like you haven't created your profile details yet. Setup your
          career highlights to attract recruiters.
        </p>
        <Link
          to="/profile"
          className="inline-flex px-6 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-100"
        >
          Create Profile Now
        </Link>
      </div>
    );
  }

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const education = Array.isArray(profile.education) ? profile.education : [];
  const experience = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Widget */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-950">
            My Professional CV
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review and manage your saved details
          </p>
        </div>
        <Link
          to="/profile"
          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-white hover:bg-indigo-50/20 text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-all shadow-sm"
        >
          Edit Profile
        </Link>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Left Column: Avatar & Contact */}
        <div className="relative rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm text-center flex flex-col items-center space-y-5 self-start">
          {/* Edit basic contact & picture */}
          <Link
            to="/profile?tab=basic"
            className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-sm"
            title="Edit Contact & Photo"
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
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Link>

          {/* Profile Picture */}
          <div className="relative">
            {profile.profileImage && isImageValid(profile.profileImage) ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-32 w-32 rounded-3xl object-cover mx-auto shadow-md ring-4 ring-slate-50 hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700 font-extrabold text-3xl shadow-inner border border-indigo-100/50">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          {/* Name & Role */}
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight truncate px-2">
              {user?.name || "User Name"}
            </h3>
            {/* {user?.role && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100 capitalize">
                {user.role}
              </span>
            )} */}
          </div>

          <hr className="w-full border-slate-100" />

          {/* Contact Details List */}
          <div className="w-full space-y-3.5 text-left text-sm">
            {/* Email */}
            {user?.email && (
              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="truncate font-semibold text-slate-800 text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Phone */}
            <div className="flex items-center gap-3 text-slate-600">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phone
                </p>
                <p className="font-semibold text-slate-800 text-xs">
                  {profile.phone || "Not specified"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-slate-600">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Location
                </p>
                <p className="font-semibold text-slate-800 text-xs capitalize">
                  {profile.location || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {profile.resume && (
            <div className="w-full pt-1">
              <a
                href={
                  profile.resume.includes("/raw/upload/")
                    ? `https://docs.google.com/gview?url=${encodeURIComponent(profile.resume)}&embedded=true`
                    : profile.resume
                }
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View PDF Resume
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Experience, Education, Skills */}
        <div className="space-y-6">
          {/* Bio */}
          <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">About Me</h3>
              <Link
                to="/profile?tab=basic"
                className="p-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-sm"
                title="Edit Bio"
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
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.bio || "No professional summary added yet."}
            </p>
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Skills</h3>
              <Link
                to="/profile?tab=basic"
                className="p-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-sm"
                title="Edit Skills"
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
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-xl border border-indigo-100 bg-indigo-50/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-600"
                  >
                    {skill.replace(/^["']|["']$/g, "")}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No skills added yet.</p>
            )}
          </section>

          {/* Experience */}
          <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                Work Experience
              </h3>
              <Link
                to="/profile?tab=experience"
                className="p-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-sm"
                title="Edit Experience"
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
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            </div>
            {experience.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-100">
                {experience.map((item, index) => (
                  <div
                    key={index}
                    className="relative pl-7 flex justify-between items-start gap-4"
                  >
                    {/* Circle timeline dot */}
                    <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-indigo-600 bg-white shadow-sm shadow-indigo-100"></span>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">
                        {item.role || "Role not added"}
                      </h4>
                      <p className="text-xs md:text-sm font-semibold text-slate-500">
                        {item.company || "Company not added"}
                      </p>
                      <p className="text-xs font-medium text-slate-400">
                        {item.current
                          ? "Currently working here"
                          : `${formatDetailDate(item.startDate)} - ${formatDetailDate(item.endDate)}`}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                        {item.description || "No description added"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteExperience(item._id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 p-1 px-2.5 border border-transparent hover:border-red-100 hover:bg-red-50/50 rounded-xl transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No experience added yet.</p>
            )}
          </section>

          {/* Education */}
          <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Education</h3>
              <Link
                to="/profile?tab=education"
                className="p-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-sm"
                title="Edit Education"
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
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            </div>
            {education.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-100">
                {education.map((item, index) => (
                  <div
                    key={index}
                    className="relative pl-7 flex justify-between items-start gap-4"
                  >
                    {/* Circle timeline dot */}
                    <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-indigo-600 bg-white shadow-sm shadow-indigo-100"></span>

                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">
                        {item.degree || "Degree not added"}
                      </h4>
                      <p className="text-xs md:text-sm font-semibold text-slate-500">
                        {item.college || "College not added"}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 font-medium">
                        <span>Graduation: {item.year || "Year not added"}</span>
                        <span>•</span>
                        <span>
                          Score:{" "}
                          {item.percentage
                            ? `${item.percentage}% / CGPA`
                            : "Score not added"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEducation(item._id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 p-1 px-2.5 border border-transparent hover:border-red-100 hover:bg-red-50/50 rounded-xl transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No education history added yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
