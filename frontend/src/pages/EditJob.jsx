import { useEffect, useState } from "react";

const EditJob = ({ job, onCancel, onUpdate }) => {
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        location: job.location || "",
        salary: job.salary || "",
        jobType: job.jobType || "",
        experienceLevel: job.experienceLevel || "",
        skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
        jobOpening: job.jobOpening || "",
        description: job.description || "",
      });
    }
  }, [job]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError("");

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

    onUpdate(newFormData, job._id);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          Edit Job Listing
        </h2>
        <p className="text-xs font-medium text-slate-400 mt-1">
          Modify the listing parameters. Updates propagate immediately.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="location" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              id="location"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          {/* Salary */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="salary" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Salary (USD per year)
            </label>
            <input
              type="number"
              id="salary"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              required
            />
          </div>

          {/* Job Type */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="jobType" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Type
            </label>
            <select
              id="jobType"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30 text-slate-700 cursor-pointer"
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value })
              }
              required
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="experiance" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Experience Level
            </label>
            <select
              id="experiance"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30 text-slate-700 cursor-pointer"
              value={formData.experienceLevel}
              onChange={(e) =>
                setFormData({ ...formData, experienceLevel: e.target.value })
              }
              required
            >
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          {/* Skills */}
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label htmlFor="skills" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Skills Required (comma-separated)
            </label>
            <input
              id="skills"
              type="text"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              required
            />
          </div>

          {/* Job Opening */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="jobOpening" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Openings
            </label>
            <input
              id="jobOpening"
              type="number"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30"
              value={formData.jobOpening}
              onChange={(e) =>
                setFormData({ ...formData, jobOpening: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Description (Min 20 chars)
            </label>
            <textarea
              id="description"
              rows="5"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all bg-slate-50/30 placeholder:text-slate-400"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 outline-none cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
