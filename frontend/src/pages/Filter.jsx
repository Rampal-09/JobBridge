import React from "react";

const Filter = ({ filters, onFilterChange, onResetFilters }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm flex flex-col gap-5 transition-all">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Filters</h3>
        <p className="text-xs text-slate-400 mt-1">Refine your job search</p>
      </div>

      <hr className="border-slate-100" />

      {/* Search Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Search
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Title, skills, keywords..."
          />
        </div>
      </div>

      {/* Location Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Location
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 placeholder:text-slate-400"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            placeholder="City, state, or remote..."
          />
        </div>
      </div>

      {/* Type Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Job Type
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 cursor-pointer text-slate-700"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {/* Status Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Status
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/70 transition-all duration-200 bg-slate-50/50 cursor-pointer text-slate-700"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        className="w-full mt-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm text-center"
        onClick={onResetFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filter;
