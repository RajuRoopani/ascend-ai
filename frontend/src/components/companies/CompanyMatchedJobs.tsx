"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { matchCompanyJobs } from "@/lib/api";
import type { JobMatch } from "@/lib/types";
import { LevelBadge } from "@/components/jobs/LevelBadge";
import { RemotePill } from "@/components/jobs/RemotePill";

const ANALYSIS_ID_KEY = "ascend_analysis_id";

function ScoreRing({ score }: { score: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "var(--green)" : score >= 60 ? "var(--amber)" : "var(--rose)";
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx="20" cy="20" r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[var(--text-1)]">
        {score}
      </span>
    </div>
  );
}

interface StaticJob {
  id: number;
  title: string;
  level: string;
  remote: boolean;
  url: string;
  location?: string;
}

interface Props {
  slug: string;
  staticJobs: StaticJob[];
}

export function CompanyMatchedJobs({ slug, staticJobs }: Props) {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [matches, setMatches] = useState<JobMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem(ANALYSIS_ID_KEY);
    if (id) setAnalysisId(Number(id));
  }, []);

  async function runMatch() {
    if (!analysisId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await matchCompanyJobs(slug, analysisId);
      setMatches(result.matches);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] font-bold text-[var(--text-3)] uppercase tracking-widest flex items-center gap-2 font-mono">
          <span>💼</span>
          {matches
            ? `Roles matched to your profile (${matches.length})`
            : `Open SWE Roles (${staticJobs.length})`}
        </h2>

        <div className="flex items-center gap-2">
          {matches && (
            <button
              onClick={() => setMatches(null)}
              className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
            >
              Clear
            </button>
          )}
          {staticJobs.length > 0 && (
            <Link
              href={`/?company_slug=${slug}`}
              className="text-xs text-[var(--accent-light)] hover:text-[var(--text-1)] font-medium transition-colors"
            >
              View all →
            </Link>
          )}
        </div>
      </div>

      {/* Profile match CTA */}
      {!matches && !loading && (
        <div className={`mb-5 rounded-xl p-4 border ${
          analysisId
            ? "bg-[rgba(99,102,241,0.06)] border-[rgba(99,102,241,0.25)]"
            : "bg-[var(--elevated)] border-[var(--border)]"
        }`}>
          {analysisId ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)] mb-0.5">
                  Match roles to your profile
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  Rank these openings by how well they fit your background
                </p>
              </div>
              <button
                onClick={runMatch}
                className="btn-primary flex-shrink-0 text-sm px-4 py-2"
              >
                Match ✨
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)] mb-0.5">
                  See which roles fit you best
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  Upload your resume to get personalized match scores
                </p>
              </div>
              <Link href="/match" className="btn-primary flex-shrink-0 text-sm px-4 py-2">
                Upload Resume →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-8 justify-center text-[var(--text-3)]">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Matching to your profile…</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--rose)]/10 border border-[var(--rose)]/20 text-sm text-[var(--rose)]">
          {error}
        </div>
      )}

      {/* Matched results */}
      {matches && !loading && (
        <div className="space-y-1.5">
          {matches.map((m) => (
            <div
              key={m.job_id}
              className="rounded-xl border border-[var(--border)] hover:border-[var(--accent-light)]/40 hover:bg-[var(--elevated)] transition-all group p-3.5"
            >
              <div className="flex items-start gap-3">
                <ScoreRing score={m.match_score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <LevelBadge level={m.level} />
                    <span className="text-sm font-semibold text-[var(--text-1)] truncate group-hover:text-[var(--accent-light)] transition-colors">
                      {m.title}
                    </span>
                    <RemotePill remote={m.remote} />
                  </div>
                  {m.match_reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {m.match_reasons.map((r, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--green)]/10 text-[var(--green)] font-medium">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  )}
                  {m.skill_gaps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.skill_gaps.map((g, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--amber)]/10 text-[var(--amber)] font-medium">
                          ↑ {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <Link href={`/jobs/${m.job_id}`} className="btn-primary text-xs py-1.5 px-3">
                    Prep ✨
                  </Link>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                    Apply
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Static job list (default, no match run yet) */}
      {!matches && !loading && (
        staticJobs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[var(--text-3)] text-sm">No open SWE roles right now</p>
            <p className="text-[var(--text-3)] text-xs mt-1 font-mono">Jobs refresh every 6 hours</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {staticJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[var(--elevated)] transition-colors group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <LevelBadge level={job.level} />
                  <span className="text-sm font-medium text-[var(--text-1)] truncate group-hover:text-[var(--accent-light)] transition-colors">
                    {job.title}
                  </span>
                  <RemotePill remote={job.remote} />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/jobs/${job.id}`} className="btn-primary text-xs py-1.5 px-3">
                    Prep ✨
                  </Link>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
