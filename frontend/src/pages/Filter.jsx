import React, { useState } from "react";

const Filter = ({ filters, onFilterChange, onResetFilters }) => {
  const [openSections, setOpenSections] = useState({
    location: true,
    type: true,
    experience: true,
    salary: true,
    status: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const jobTypes = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Internship", value: "Internship" },
    { label: "Remote", value: "remote" },
    { label: "Contract", value: "contract" },
  ];

  const experienceLevels = [
    { label: "Entry Level", value: "entry" },
    { label: "Mid Level", value: "mid" },
    { label: "Senior Level", value: "senior" },
    { label: "Lead Level", value: "lead" },
  ];

  const hasActiveFilters =
    filters.location ||
    filters.type ||
    filters.status ||
    filters.experienceLevel ||
    filters.minSalary > 0;

  return (
    <div className="w-full h-full bg-white flex flex-col transition-all border-r border-slate-200/80 overflow-y-auto">
      {/* Header inside Filter sidebar touching header bottom */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200/70 bg-white sticky top-0 z-10 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display leading-tight">
            Filters
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Refine your job search
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer bg-indigo-50/80 hover:bg-indigo-100/80 px-2.5 py-1 rounded-xl border border-indigo-100"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections with smooth vertical accordion dropdowns */}
      <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-100 *:pt-4 first:*:pt-0 flex-1">
        {/* 1. Location Section */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection("location")}
            className="flex items-center justify-between w-full text-left font-display text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer py-1 select-none"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </div>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                openSections.location ? "rotate-180 text-indigo-600" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
              openSections.location ? "grid-rows-[1fr] opacity-100 pt-2" : "grid-rows-[0fr] opacity-0 pt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="relative pb-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50/70 transition-all bg-slate-50/50 placeholder:text-slate-400"
                  value={filters.location || ""}
                  onChange={(e) => onFilterChange("location", e.target.value)}
                  placeholder="City, country, or remote..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Job Type Section (Vertical Dropdown List) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection("type")}
            className="flex items-center justify-between w-full text-left font-display text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer py-1 select-none"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Job Type
            </div>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                openSections.type ? "rotate-180 text-indigo-600" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
              openSections.type ? "grid-rows-[1fr] opacity-100 pt-2" : "grid-rows-[0fr] opacity-0 pt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-1.5 pb-1">
                {jobTypes.map((type) => {
                  const isActive = filters.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => onFilterChange("type", isActive ? "" : type.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer flex items-center justify-between text-left ${
                        isActive
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-bold"
                          : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full transition-colors ${
                            isActive ? "bg-indigo-600 ring-2 ring-indigo-200" : "bg-slate-300"
                          }`}
                        ></span>
                        {type.label}
                      </span>
                      {isActive && (
                        <span className="text-indigo-600 text-xs font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Experience Level Section (Vertical Dropdown List) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection("experience")}
            className="flex items-center justify-between w-full text-left font-display text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer py-1 select-none"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Experience Level
            </div>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                openSections.experience ? "rotate-180 text-indigo-600" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
              openSections.experience ? "grid-rows-[1fr] opacity-100 pt-2" : "grid-rows-[0fr] opacity-0 pt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-1.5 pb-1">
                {experienceLevels.map((exp) => {
                  const isActive = filters.experienceLevel === exp.value;
                  return (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => onFilterChange("experienceLevel", isActive ? "" : exp.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer flex items-center justify-between text-left ${
                        isActive
                          ? "bg-violet-50 border-violet-300 text-violet-700 shadow-2xs font-bold"
                          : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full transition-colors ${
                            isActive ? "bg-violet-600 ring-2 ring-violet-200" : "bg-slate-300"
                          }`}
                        ></span>
                        {exp.label}
                      </span>
                      {isActive && (
                        <span className="text-violet-600 text-xs font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Salary Section */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection("salary")}
            className="flex items-center justify-between w-full text-left font-display text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer py-1 select-none"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Minimum Salary
            </div>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                openSections.salary ? "rotate-180 text-indigo-600" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
              openSections.salary ? "grid-rows-[1fr] opacity-100 pt-2" : "grid-rows-[0fr] opacity-0 pt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-2 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Min Pay</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">
                    {filters.minSalary > 0
                      ? `$${Number(filters.minSalary).toLocaleString()}/yr`
                      : "Any Salary"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  value={filters.minSalary || 0}
                  onChange={(e) => onFilterChange("minSalary", Number(e.target.value))}
                />
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold px-0.5">
                  <span>$0</span>
                  <span>$100k</span>
                  <span>$200k+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Job Status Section (Vertical Dropdown List) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection("status")}
            className="flex items-center justify-between w-full text-left font-display text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer py-1 select-none"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Job Status
            </div>
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-300 ease-in-out ${
                openSections.status ? "rotate-180 text-indigo-600" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
              openSections.status ? "grid-rows-[1fr] opacity-100 pt-2" : "grid-rows-[0fr] opacity-0 pt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => onFilterChange("status", filters.status === "open" ? "" : "open")}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer flex items-center justify-between text-left ${
                    filters.status === "open"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs font-bold"
                      : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Open Jobs
                  </span>
                  {filters.status === "open" && (
                    <span className="text-emerald-700 text-xs font-bold">✓</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onFilterChange("status", filters.status === "closed" ? "" : "closed")}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer flex items-center justify-between text-left ${
                    filters.status === "closed"
                      ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs font-bold"
                      : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Closed Jobs
                  </span>
                  {filters.status === "closed" && (
                    <span className="text-rose-700 text-xs font-bold">✓</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
