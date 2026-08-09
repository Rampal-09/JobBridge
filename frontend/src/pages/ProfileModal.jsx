import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  updateProfile,
  addProfileEducation,
  addProfileExperience,
  getMyProfile,
  deleteProfileEducation,
  deleteProfileExperience,
} from "../api/job";
import { useAuth } from "../context/Context";

const createEducationItem = () => ({
  degree: "",
  college: "",
  year: "",
  percentage: "",
});

const createExperienceItem = () => ({
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const ProfileModal = () => {
  const { user } = useAuth();
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get("tab") || location.state?.tab;

  const [formdata, setFormData] = useState({
    phone: "",
    location: "",
    profileImage: null,
    skills: "",
    education: [createEducationItem()],
    experience: [createExperienceItem()],
    resume: null,
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(queryTab || "basic");

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      try {
        const res = await getMyProfile();
        if (res?.data) {
          const profile = res.data;
          setFormData({
            phone: profile.phone || "",
            location: profile.location || "",
            profileImage: null,
            skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
            education: profile.education?.length ? profile.education : [createEducationItem()],
            experience: profile.experience?.length
              ? profile.experience.map((exp) => ({
                  ...exp,
                  startDate: formatDateForInput(exp.startDate),
                  endDate: formatDateForInput(exp.endDate),
                }))
              : [createExperienceItem()],
            resume: null,
            bio: profile.bio || "",
          });
        }
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    };
    loadProfile();
  }, [user]);

  const addEducation = () => {
    setFormData({
      ...formdata,
      education: [...formdata.education, createEducationItem()],
    });
  };

  const deleteEducation = async (i) => {
    const itemToDelete = formdata.education[i];
    if (itemToDelete?._id) {
      try {
        setLoading(true);
        setMessage("");
        await deleteProfileEducation(itemToDelete._id);
        setMessage("Education item deleted successfully.");
      } catch (err) {
        console.log("Delete education error", err);
        setMessage(err?.message || "Unable to delete education item.");
        setLoading(false);
        return;
      }
    }
    setFormData({
      ...formdata,
      education: formdata.education.filter((item, idx) => idx !== i),
    });
    setLoading(false);
  };

  const addExperiance = () => {
    setFormData({
      ...formdata,
      experience: [...formdata.experience, createExperienceItem()],
    });
  };

  const deleteExp = async (i) => {
    const itemToDelete = formdata.experience[i];
    if (itemToDelete?._id) {
      try {
        setLoading(true);
        setMessage("");
        await deleteProfileExperience(itemToDelete._id);
        setMessage("Experience item deleted successfully.");
      } catch (err) {
        console.log("Delete experience error", err);
        setMessage(err?.message || "Unable to delete experience item.");
        setLoading(false);
        return;
      }
    }
    setFormData({
      ...formdata,
      experience: formdata.experience.filter((exp, idx) => idx !== i),
    });
    setLoading(false);
  };

  const handleBasicProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("phone", formdata.phone);
      fd.append("location", formdata.location);
      fd.append("skills", formdata.skills);
      fd.append("bio", formdata.bio);

      if (formdata.profileImage) {
        fd.append("profileImage", formdata.profileImage);
      }

      if (formdata.resume) {
        fd.append("resume", formdata.resume);
      }

      await updateProfile(fd);
      setMessage("Basic profile saved successfully.");
    } catch (err) {
      console.log("profile error", err);
      setMessage(err?.message || "Unable to save profile right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleEducationSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addProfileEducation({ education: formdata.education });
      setMessage("Education saved successfully.");
    } catch (err) {
      console.log("education error", err);
      setMessage(err?.message || "Unable to save education.");
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addProfileExperience({ experience: formdata.experience });
      setMessage("Experience saved successfully.");
    } catch (err) {
      console.log("experience error", err);
      setMessage(err?.message || "Unable to save experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Build Your Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Complete your profile step-by-step. Add your basic contact details, education, and career experience.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 text-center font-medium">
          {message}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => {
            setActiveTab("basic");
            setMessage("");
          }}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "basic"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          1. Basic Details
        </button>
        <button
          onClick={() => {
            setActiveTab("education");
            setMessage("");
          }}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "education"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          2. Education
        </button>
        <button
          onClick={() => {
            setActiveTab("experience");
            setMessage("");
          }}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "experience"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          3. Experience
        </button>
      </div>

      {/* Forms Container */}
      <div className="pt-2">
        {/* Tab 1: Basic Profile */}
        {activeTab === "basic" && (
          <form className="space-y-6" onSubmit={handleBasicProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
                  value={formdata.phone}
                  onChange={(e) =>
                    setFormData({ ...formdata, phone: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
                  value={formdata.location}
                  onChange={(e) =>
                    setFormData({ ...formdata, location: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 cursor-pointer"
                  onChange={(e) =>
                    setFormData({
                      ...formdata,
                      profileImage: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Skills Tag Cloud
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, Mongoose, Tailwind CSS..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
                  value={formdata.skills}
                  onChange={(e) =>
                    setFormData({ ...formdata, skills: e.target.value })
                  }
                />
                <p className="text-xs text-slate-400">
                  Separate skills with commas (e.g. JavaScript, Python).
                </p>
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Professional Bio
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell recruiters about your background, skills, and aspirations..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
                  value={formdata.bio}
                  onChange={(e) =>
                    setFormData({ ...formdata, bio: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Resume / CV (PDF Only)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formdata, resume: e.target.files[0] })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 outline-none cursor-pointer"
              >
                {loading ? "Saving..." : "Save Basic Info"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Education Profile */}
        {activeTab === "education" && (
          <form className="space-y-6" onSubmit={handleEducationSave}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Education Details</h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-indigo-600 border border-indigo-200 hover:bg-indigo-50/40 transition-colors cursor-pointer"
              >
                + Add New Row
              </button>
            </div>

            <div className="space-y-4">
              {formdata.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/60 rounded-2xl border border-slate-200/50 p-5 space-y-4 relative"
                >
                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteEducation(idx)}
                      className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      Remove Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Degree / Specialization
                      </label>
                      <input
                        type="text"
                        placeholder="Bachelor of Science in CS"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={edu.degree}
                        onChange={(e) =>
                          setFormData({
                            ...formdata,
                            education: formdata.education.map((item, i) =>
                              idx === i
                                ? { ...item, degree: e.target.value }
                                : item,
                            ),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        College / University
                      </label>
                      <input
                        type="text"
                        placeholder="Stanford University"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={edu.college}
                        onChange={(e) =>
                          setFormData({
                            ...formdata,
                            education: formdata.education.map((item, i) =>
                              idx === i
                                ? { ...item, college: e.target.value }
                                : item,
                            ),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Passing Year
                      </label>
                      <input
                        type="number"
                        placeholder="2024"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={edu.year}
                        onChange={(e) =>
                          setFormData({
                            ...formdata,
                            education: formdata.education.map((item, i) =>
                              idx === i
                                ? { ...item, year: e.target.value }
                                : item,
                            ),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Percentage / CGPA
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="3.8"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={edu.percentage}
                        onChange={(e) =>
                          setFormData({
                            ...formdata,
                            education: formdata.education.map((item, i) =>
                              idx === i
                                ? { ...item, percentage: e.target.value }
                                : item,
                            ),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 outline-none cursor-pointer"
              >
                {loading ? "Saving..." : "Save Education Info"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Experience Profile */}
        {activeTab === "experience" && (
          <form className="space-y-6" onSubmit={handleExperienceSave}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Experience History</h3>
              <button
                type="button"
                onClick={addExperiance}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-indigo-600 border border-indigo-200 hover:bg-indigo-50/40 transition-colors cursor-pointer"
              >
                + Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {formdata.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/60 rounded-2xl border border-slate-200/50 p-5 space-y-4 relative"
                >
                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteExp(idx)}
                      className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      Remove Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Google LLC"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={exp.company}
                        onChange={(e) => {
                          const experience = [...formdata.experience];
                          experience[idx] = {
                            ...experience[idx],
                            company: e.target.value,
                          };
                          setFormData({ ...formdata, experience });
                        }}
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Job Title / Role
                      </label>
                      <input
                        type="text"
                        placeholder="Software Engineer"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={exp.role}
                        onChange={(e) => {
                          const experience = [...formdata.experience];
                          experience[idx] = {
                            ...experience[idx],
                            role: e.target.value,
                          };
                          setFormData({ ...formdata, experience });
                        }}
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500"
                        value={exp.startDate}
                        onChange={(e) => {
                          const experience = [...formdata.experience];
                          experience[idx] = {
                            ...experience[idx],
                            startDate: e.target.value,
                          };
                          setFormData({ ...formdata, experience });
                        }}
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        End Date
                      </label>
                      <input
                        type="date"
                        disabled={exp.current}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none bg-white focus:border-indigo-500 disabled:bg-slate-100"
                        value={exp.current ? "" : exp.endDate}
                        onChange={(e) => {
                          const experience = [...formdata.experience];
                          experience[idx] = {
                            ...experience[idx],
                            endDate: e.target.value,
                          };
                          setFormData({ ...formdata, experience });
                        }}
                        required={!exp.current}
                      />
                    </div>

                    <div className="flex items-center gap-2 md:col-span-2">
                      <input
                        type="checkbox"
                        id={`current_${idx}`}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={exp.current}
                        onChange={(e) => {
                          const experience = [...formdata.experience];
                          experience[idx] = {
                            ...experience[idx],
                            current: e.target.checked,
                            endDate: e.target.checked ? "" : experience[idx].endDate,
                          };
                          setFormData({ ...formdata, experience });
                        }}
                      />
                      <label htmlFor={`current_${idx}`} className="text-sm font-semibold text-slate-700">
                        I am currently working in this role
                      </label>
                    </div>

                    <div className="flex flex-col space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Role Description
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Detail key responsibilities, projects, technologies used..."
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-white placeholder:text-slate-400"
                        value={exp.description}
                        onChange={(e) => {
                          const experience = [...formdata.experience];
                          experience[idx] = {
                            ...experience[idx],
                            description: e.target.value,
                          };
                          setFormData({ ...formdata, experience });
                        }}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 outline-none cursor-pointer"
              >
                {loading ? "Saving..." : "Save Experience Info"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
