import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../api/job";
import { useAuth } from "../context/Context";
import Filter from "./Filter";
import JobList from "./JobList";
import Layout from "../component/Layout";

const BrowseJobs = ({
  favoriteJobIds = [],
  applyJobIds = [],
  onFavorite,
  handleApply,
  onEditing,
  onDeleteJob,
}) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize filters from URL query params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    minSalary: Number(searchParams.get("minSalary")) || 0,
  });

  // Sync state when URL params change
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
      status: searchParams.get("status") || "",
      experienceLevel: searchParams.get("experienceLevel") || "",
      minSalary: Number(searchParams.get("minSalary")) || 0,
    });
    setPage(1);
  }, [searchParams]);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const res = await getJobs({ ...filters, page, limit: 6 });
        setJobs(res.jobs || []);
        setTotalPages(res.totalPages || 1);
        setTotalJobs(res.totalJobs || 0);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [filters, page]);

  const handleFilterChange = (name, value) => {
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    setPage(1);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams, { replace: true });
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: "",
      location: "",
      type: "",
      status: "",
      experienceLevel: "",
      minSalary: 0,
    };
    setFilters(emptyFilters);
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const activeFilterCount = [
    filters.location,
    filters.type,
    filters.status,
    filters.experienceLevel,
    filters.minSalary > 0 ? filters.minSalary : "",
  ].filter(Boolean).length;

  return (
    <Layout fullWidth={true} sidebarOffset={true}>
      {/* Full-width docked fixed split layout with distinct gap between sidebar and cards */}
      <div className="relative w-full min-h-[calc(100vh-4.05rem)]">
        {/* Left Column: Fixed to the screen left edge and touching header bottom */}
        <aside className="hidden lg:block fixed top-[4.05rem] left-0 bottom-0 w-72 xl:w-80 z-30 bg-white">
          <Filter
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        </aside>

        {/* Right Column: Main Content Area with generous gap from sidebar and right edge */}
        <main className="w-full lg:pl-[20.5rem] xl:pl-[23rem] p-4 sm:p-6 lg:p-8 lg:pr-10 xl:pr-14 space-y-6">
          <div className="max-w-6xl space-y-6">
            {/* Top Search & Filter Summary Bar */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 font-display">
                    Explore Job Openings
                  </h1>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {totalJobs > 0
                      ? `${totalJobs} live verified positions available`
                      : "Search across real active openings"}
                  </p>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="self-start text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-colors cursor-pointer"
                  >
                    Reset Filters ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Quick Search Input */}
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by title, skill, or role..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 pl-11 pr-24 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all bg-slate-50/50"
                />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              {/* Popular Search Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
                <span className="font-bold text-slate-400 mr-1 uppercase tracking-wider text-[10px]">
                  Quick Tags:
                </span>
                {["React", "Node.js", "Python", "Full Stack", "Remote", "Internship"].map((tag) => {
                  const isSelected =
                    tag.toLowerCase() === "remote"
                      ? filters.type === "remote"
                      : tag.toLowerCase() === "internship"
                      ? filters.type === "Internship"
                      : filters.search.toLowerCase() === tag.toLowerCase();

                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        if (tag.toLowerCase() === "remote") {
                          handleFilterChange("type", isSelected ? "" : "remote");
                        } else if (tag.toLowerCase() === "internship") {
                          handleFilterChange("type", isSelected ? "" : "Internship");
                        } else {
                          handleFilterChange("search", isSelected ? "" : tag);
                        }
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Inline Filter Trigger Bar */}
            <div className="lg:hidden flex items-center justify-between bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 font-display">Filters</span>
                <span className="text-xs text-slate-400">
                  {jobs.length > 0 ? `${totalJobs} matching jobs` : "Narrow results"}
                </span>
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-bold px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2 cursor-pointer transition-colors text-xs"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-extrabold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Job List Directory */}
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
        </main>
      </div>

      {/* Mobile Slide-Over Drawer for Filters */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-slate-900/40 backdrop-blur-xs p-0 animate-modal-backdrop">
          <div className="w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 flex flex-col animate-modal-content">
            {/* Header bar of drawer */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span className="text-base font-bold text-slate-800 font-display">Filters</span>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-md"
              >
                Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BrowseJobs;
