import React from "react";

const SkeletonCard = () => {
  return (
    <div className="relative flex flex-col justify-between bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm min-h-[300px]">
      <div className="space-y-5 animate-pulse">
        {/* Header Title & Status */}
        <div className="space-y-2.5 pr-10">
          <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
        </div>

        {/* Job Metadata tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-7 bg-slate-100 rounded-xl w-24"></div>
          <div className="h-7 bg-slate-100 rounded-xl w-20"></div>
          <div className="h-7 bg-slate-100 rounded-xl w-28"></div>
        </div>

        {/* Description Snippet */}
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-200 rounded-lg w-full"></div>
          <div className="h-3.5 bg-slate-200 rounded-lg w-11/12"></div>
          <div className="h-3.5 bg-slate-200 rounded-lg w-4/5"></div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <div className="h-6 bg-slate-100 rounded-lg w-16"></div>
          <div className="h-6 bg-slate-100 rounded-lg w-14"></div>
          <div className="h-6 bg-slate-100 rounded-lg w-20"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
