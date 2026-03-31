import Link from "next/link";
import type { CompanyDetail } from "@/lib/types";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";

type JobRow = CompanyDetail["jobs"][number];

interface ResearchJobListingsProps {
  /** null = company not tracked; [] = tracked but no open roles; array = has jobs */
  jobs: JobRow[] | null;
  companyName: string;
}

export function ResearchJobListings({ jobs, companyName }: ResearchJobListingsProps) {
  if (jobs === null) {
    return (
      <div className="card-static mx-6 mb-4 px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-1)]">No open roles tracked for {companyName}</p>
          <p className="text-xs text-[var(--text-3)]">We track 31 companies — browse to see who&apos;s hiring.</p>
        </div>
        <Link href="/companies" className="btn-ghost text-xs px-3 py-1.5 flex-shrink-0">
          Browse all companies →
        </Link>
      </div>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="mx-6 mb-4">
      <h2 className="text-xs font-bold text-[var(--text-3)] uppercase tracking-widest mb-3">
        Open Roles · {jobs.length}
      </h2>
      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <a
            key={job.id}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-static px-4 py-3 flex items-center gap-3 hover:border-[var(--accent-light)]/40 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-1)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                {job.title}
              </p>
              <p className="text-[11px] text-[var(--text-3)] mt-0.5 truncate">
                {job.department && `${job.department} · `}{job.location || "Remote"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <LevelBadge level={job.level} />
              <RemotePill remote={job.remote} />
              <svg className="w-3.5 h-3.5 text-[var(--text-3)] group-hover:text-[var(--accent-light)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
