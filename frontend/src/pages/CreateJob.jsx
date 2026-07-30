import { useState } from "react";
import { createJob } from "../api/job";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    jobType: "",
    experienceLevel: "",
    skills: "",
    jobOpening: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.salary ||
      !formData.jobType ||
      !formData.experienceLevel ||
      !formData.skills.trim() ||
      !formData.jobOpening ||
      !formData.description.trim()
    ) {
      setError("Please fill out all fields.");
      return;
    }

    const newSalary = Number(formData.salary);
    const newJobOpening = Number(formData.jobOpening);

    if (isNaN(newSalary) || newSalary <= 0) {
      setError("Salary must be a positive number.");
      return;
    }

    if (isNaN(newJobOpening) || newJobOpening <= 0) {
      setError("Job openings must be a positive number.");
      return;
    }

    const newSkills = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => Boolean(s));

    if (newSkills.length === 0) {
      setError("Please specify at least one skill.");
      return;
    }

    const newFormData = {
      title: formData.title.trim(),
      location: formData.location.trim(),
      salary: newSalary,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      skills: newSkills,
      jobOpening: newJobOpening,
      description: formData.description.trim(),
    };

    setLoading(true);
    try {
      await createJob(newFormData);
      setMessage("Job listing posted successfully!");
      setFormData({
        title: "",
        location: "",
        salary: "",
        jobType: "",
        experienceLevel: "",
        skills: "",
        jobOpening: "",
        description: "",
      });
      // Redirect to jobs list after 1.5s
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err);
      setError(err?.message || "Unable to create job listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Post a New Position
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide accurate job details, requirements, and salary. New listings appear on the job feed instantly.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 text-center font-medium">
          {message}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleCreateJob}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Job Title */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label htmlFor="title" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Lead React Developer"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="location" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="e.g. London, UK or Remote"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          {/* Salary */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="salary" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Salary (USD per year)
            </label>
            <input
              type="number"
              id="salary"
              placeholder="e.g. 120000"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              required
            />
          </div>

          {/* Job Type */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="jobType" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Job Type
            </label>
            <select
              id="jobType"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 cursor-pointer text-slate-700"
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value })
              }
              required
            >
              <option value="">Choose Job Type...</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="experience" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Experience Level
            </label>
            <select
              id="experience"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 cursor-pointer text-slate-700"
              value={formData.experienceLevel}
              onChange={(e) =>
                setFormData({ ...formData, experienceLevel: e.target.value })
              }
              required
            >
              <option value="">Choose Experience...</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          {/* Skills Required */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label htmlFor="skills" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Required Skills
            </label>
            <input
              type="text"
              id="skills"
              placeholder="e.g. React, Node.js, GraphQL, AWS"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              required
            />
            <p className="text-xs text-slate-400">
              Separate skills with commas (e.g. JavaScript, CSS, HTML5).
            </p>
          </div>

          {/* Job Openings */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="jobOpening" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Openings
            </label>
            <input
              type="number"
              id="jobOpening"
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
              value={formData.jobOpening}
              onChange={(e) =>
                setFormData({ ...formData, jobOpening: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label htmlFor="description" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Job Description (Min 20 chars)
            </label>
            <textarea
              id="description"
              rows="6"
              placeholder="Detail key responsibilities, role specifications, candidate background expectations..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 outline-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Posting Job..." : "Post Job Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
