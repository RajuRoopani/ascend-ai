import type { Job } from "@/lib/types";
import { JobCard } from "./JobCard";

interface JobGridProps {
  jobs: Job[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-1/3" />
          <div className="h-4 bg-slate-100 rounded-full w-5/6" />
          <div className="h-4 bg-slate-100 rounded-full w-3/4" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-24 bg-slate-100 rounded-lg" />
        <div className="h-6 w-16 bg-slate-100 rounded-lg" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-28 bg-slate-100 rounded-full" />
        <div className="h-3 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="flex gap-2 pt-1 border-t border-slate-50">
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
        <div className="w-20 h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export function JobGrid({ jobs, loading }: JobGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-slate-700 mb-1">No jobs found</p>
        <p className="text-sm text-slate-400">Try broadening your search or clearing filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {jobs.map((job) => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
